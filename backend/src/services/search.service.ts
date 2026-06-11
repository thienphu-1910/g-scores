import { prisma } from "../config/prisma.js";
import { Scores } from "../types/Scores.js";

export const searchService = {
  findScoresViaRegistrationNumber: async (regisNumber: string) => {
    try {
      const scores: Scores | null = await prisma.scores.findUnique({
        where: { regisNumber: regisNumber },
      });
  
      const filterNullScore = (scores: Scores | null): Partial<Scores> | null => {        
        if (scores) {
          const filtered = Object.entries(scores).reduce(
            (acc, [key, value]) => {
              if (value !== null) acc[key] = value; 
              return acc;
            },
            {} as Record<string, any>,
          );
          return filtered as Partial<Scores>;
        }

        return null;
      }

      const filtered = filterNullScore(scores);
      const { regisNumber: rn, id, createdAt, ...rest } = filtered ?? {};
      const responseData = {
        regisNumber: rn,
        id: id,
        createdAt: createdAt,
        scores: rest
      }

      return responseData;
    } catch (e) {
      throw e;
    }
  }
}