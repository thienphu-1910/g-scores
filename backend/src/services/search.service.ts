import { prisma } from "../config/prisma.js";
import { CandidateScores } from "../types/CandidateScores.js";

export const searchService = {
  findScoresViaRegistrationNumber: async (regisNumber: string) => {
    try {
      const scores: CandidateScores | null =
        await prisma.candidateScores.findUnique({
          where: { regisNumber: regisNumber },
        });

      const filterNullScore = (
        scores: CandidateScores | null,
      ): Partial<CandidateScores> | null => {
        if (scores) {
          const filtered = Object.entries(scores).reduce(
            (acc, [key, value]) => {
              if (value !== null) acc[key] = value;
              return acc;
            },
            {} as Record<string, any>,
          );
          return filtered as Partial<CandidateScores>;
        }

        return null;
      };

      const filtered = filterNullScore(scores);
      const { regisNumber: rn, createdAt, ...rest } = filtered ?? {};
      const responseData = {
        regisNumber: rn,        
        createdAt: createdAt,
        scores: rest,
      };

      return responseData;
    } catch (e) {
      throw e;
    }
  },
};
