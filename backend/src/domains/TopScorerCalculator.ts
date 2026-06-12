import { prisma } from "../config/prisma.js";
import { SubjectGroup } from "./SubjectGroup.js";

export interface CandidateTotal {
  regisNumber: string;
  totalScore: number;
  [key: string]: string | number; // To hold the individual scores
}

/**
 * Responsible for executing the query and calculating the top N candidates
 */
export class TopScorerCalculator {
  constructor(private subjectGroup: SubjectGroup) {}

  public async getTopScorers(limit: number = 10): Promise<CandidateTotal[]> {
    const targetFields = this.subjectGroup.getTargetFields();

    // 1. Build dynamic selection mapping for Prisma
    const selectArgs: Record<string, boolean> = { regisNumber: true };
    targetFields.forEach((field) => (selectArgs[field] = true));

    // 2. Fetch all non-null candidates for this specific group
    // Using any type to bypass strict Prisma dynamic key restrictions safely
    const candidates = await (prisma.candidateScores as any).findMany({
      where: this.subjectGroup.getPrismaWhereClause(),
      select: selectArgs,
    });

    // 3. Calculate totals in memory
    const scoredCandidates: CandidateTotal[] = candidates.map(
      (candidate: any) => {
        let totalScore = 0;
        targetFields.forEach((field) => {
          totalScore += Number(candidate[field] || 0);
        });

        return {
          ...candidate,
          totalScore,
        };
      },
    );

    // 4. Sort descending and slice the top 10
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    return scoredCandidates.slice(0, limit);
  }
}
