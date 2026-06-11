/*
  Warnings:

  - You are about to drop the `scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "scores";

-- CreateTable
CREATE TABLE "candidate_scores" (
    "regis_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "math_score" DECIMAL(5,2),
    "literature_score" DECIMAL(5,2),
    "foreign_lg_score" DECIMAL(5,2),
    "physics_score" DECIMAL(5,2),
    "chemistry_score" DECIMAL(5,2),
    "biology_score" DECIMAL(5,2),
    "history_score" DECIMAL(5,2),
    "geography_score" DECIMAL(5,2),
    "phy_edu_score" DECIMAL(5,2),
    "foreign_lg_code" "ForeignLanguageCode",

    CONSTRAINT "candidate_scores_pkey" PRIMARY KEY ("regis_number")
);
