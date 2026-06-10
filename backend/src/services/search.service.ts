import { prisma } from "../config/prisma.js";

export const searchService = {
  findScoresViaRegistrationNumber: async (regisNumber: string) => {
    try {
      const scores = await prisma.scores.findUnique({
        where: { regisNumber: regisNumber },
      });
  
      const filterNullScore = (scores: object | null): object | null => {        
        if (scores) {
          const filtered = Object.entries(scores).reduce<Record<string, any>>(
            (acc, [key, value]) => {
              if (value !== null) acc[key] = value;
              return acc;
            },
            {},
          );
          return filtered;
        }

        return null;
      }

      return filterNullScore(scores);
    } catch (e) {
      throw e;
    }
  }
}