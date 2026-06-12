import { Subjects } from "../enums/Subjects.js";

/**
 * Encapsulates a group of subjects.
 * Responsible for standardizing keys and generating dynamic database fields.
 */
export class SubjectGroup {
  public readonly subjects: Subjects[];
  public readonly groupCode: string;

  constructor(subjects: string[]) {
    // 1. Filter out invalid subjects, cast to Enum, and SORT them alphabetically.
    // Sorting ensures ["math", "physics"] and ["physics", "math"] generate the same cache key.
    this.subjects = subjects
      .filter((s) => Object.values(Subjects).includes(s as Subjects))
      .map((s) => s as Subjects)
      .sort();

    // 2. Generate a deterministic code like "chemistry_math_physics"
    this.groupCode = this.subjects.join("_");
  }

  // Generate the Prisma column names (e.g., "mathScore")
  public getTargetFields(): string[] {
    return this.subjects.map((subject) => `${subject}Score`);
  }

  // Generate the Prisma where clause requiring all grouped subjects to be NOT NULL
  public getPrismaWhereClause(): Record<string, { not: null }> {
    const where: Record<string, { not: null }> = {};
    this.getTargetFields().forEach((field) => {
      where[field] = { not: null };
    });
    return where;
  }
}
