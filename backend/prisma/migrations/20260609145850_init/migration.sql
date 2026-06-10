-- CreateEnum
CREATE TYPE "ForeignLanguageCode" AS ENUM ('N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7');

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regis_number" TEXT NOT NULL,
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

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scores_regis_number_key" ON "scores"("regis_number");
