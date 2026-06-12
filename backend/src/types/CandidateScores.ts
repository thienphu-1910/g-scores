import { Decimal } from "../generated/prisma/internal/prismaNamespace.js";
import { ForeignLanguageCode } from "../generated/prisma/enums.js";
import { Subjects } from "../enums/Subjects.js";

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

export const VALID_SUBJECTS = new Set<string>(Object.values(Subjects));

/**
 * Narrows an unknown string to Subjects, or returns null.
 * Use this at API boundaries (req.body / req.query) so the rest
 * of the codebase only ever sees the enum type.
 */
export const parseSubject = (value: string): Subjects | null =>
  VALID_SUBJECTS.has(value) ? (value as Subjects) : null;

export interface TopScoreJobData {
  subjects: Subjects[];
  groupKey: string; // e.g. "math,physics,chemistry"
}

export interface CandidateRawScore {
  registrationNumber: string;
  [subject: string]: number | string | null;
}

export interface CandidateTotal {
  registrationNumber: string;
  total: number;
  scores: Partial<Record<Subjects, number>>;
}

export interface TopScoreResult {
  groupKey: string;
  subjects: Subjects[];
  top10: CandidateTotal[];
  calculatedAt: string;
}