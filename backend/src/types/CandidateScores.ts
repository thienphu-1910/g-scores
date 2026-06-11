import { Decimal } from "../generated/prisma/internal/prismaNamespace.js";
import { ForeignLanguageCode } from "../generated/prisma/enums.js";

export type CandidateScores = {
  regisNumber: string;  
  createdAt: Date;
  mathScore: Decimal | null;
  literatureScore: Decimal | null;
  foreignLgScore: Decimal | null;
  physicsScore: Decimal | null;
  chemistryScore: Decimal | null;
  biologyScore: Decimal | null;
  historyScore: Decimal | null;
  geographyScore: Decimal | null;
  phyEduScore: Decimal | null;
  foreignLgCode: ForeignLanguageCode | null;
};