import "dotenv/config";
import {
  PrismaClient,
  ForeignLanguageCode,
} from "../src/generated/prisma/client.ts";
import fs from "fs";
import csv from "csv-parser";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type Scores = {
  regisNumber: string;
  mathScore: number | null;
  literatureScore: number | null;
  foreignLgScore: number | null;
  physicsScore: number | null;
  chemistryScore: number | null;
  biologyScore: number | null;
  historyScore: number | null;
  geographyScore: number | null;
  phyEduScore: number | null;
  foreignLgCode: ForeignLanguageCode | null;
};

function parseLoadedData(data: any): Scores {
  const {
    mathScore,
    literatureScore,
    foreignLgScore,
    physicsScore,
    chemistryScore,
    biologyScore,
    historyScore,
    geographyScore,
    phyEduScore,
  } = data;

  const parseScore = (score: string): number | null => {
    if (score.length === 0) return null;
    return Number.parseFloat(score);
  };

  const parseForeignLanguageCode = (code: string): string | null => {
    return code in ForeignLanguageCode
      ? ForeignLanguageCode[code as keyof typeof ForeignLanguageCode]
      : null;
  };

  const foreignLgCode: string = data.foreignLgCode;

  const result: Scores = {
    ...data,
    mathScore: parseScore(mathScore),
    literatureScore: parseScore(literatureScore),
    foreignLgScore: parseScore(foreignLgScore),
    physicsScore: parseScore(physicsScore),
    chemistryScore: parseScore(chemistryScore),
    biologyScore: parseScore(biologyScore),
    historyScore: parseScore(historyScore),
    geographyScore: parseScore(geographyScore),
    phyEduScore: parseScore(phyEduScore),
    foreignLgCode: parseForeignLanguageCode(foreignLgCode)
  };

  return result;
}

function loadCSV(filePath: string): Promise<Scores[]> {
  return new Promise((resolve, reject) => {
    const results: Scores[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(parseLoadedData(data)))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function main() {
  const results = await loadCSV("../dataset/diem_thi_thpt_2024.csv");

  console.log(`Seeding ${results.length} records...`);

  const CHUNK_SIZE = 1000;
  const totalSize = results.length;

  let chunkCount = 0;
  while (chunkCount < totalSize) {
    try {
      const createMany = await prisma.candidateScores.createMany({
        data: results.slice(chunkCount, chunkCount + CHUNK_SIZE),
        skipDuplicates: true,
      });           
    } catch (e) {
      console.error(e);
    }

    chunkCount += CHUNK_SIZE;
  }

  validation();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

async function validation() {
  const results = await loadCSV("../dataset/diem_thi_thpt_2024.csv");
  const scores = await prisma.candidateScores.findMany();
  

  console.log(`CSV rows: ${results.length}`);
  console.log(`Prisma rows: ${scores.length}`);
  if (results.length === scores.length) {    
    console.log("=====> Data has been seeded <=====");
  }
}