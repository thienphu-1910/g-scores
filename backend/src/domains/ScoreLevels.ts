import { ScoreBand } from "../enums/ScoreBand.js";

interface PrismaScoreFilter {
  gte: number;
  lt?: number;
}

export class ScoreLevel {
  constructor(
    public readonly key: ScoreBand,
    public readonly gte: number,
    public readonly lt?: number, 
  ) {}

  getPrismaWhereClause(targetField: string): Record<string, PrismaScoreFilter> {
    const filter: PrismaScoreFilter = { gte: this.gte };
    if (this.lt !== undefined) {
      filter.lt = this.lt;
    }
    return { [targetField]: filter };
  }
}

export class GradingConfig {
  static readonly EXCELLENT = new ScoreLevel(ScoreBand.EXCELLENT, 8.0, 10.0); 
  static readonly GOOD = new ScoreLevel(ScoreBand.GOOD, 6.0, 8.0);
  static readonly AVERAGE = new ScoreLevel(ScoreBand.AVERAGE, 4.0, 6.0);
  static readonly POOR = new ScoreLevel(ScoreBand.POOR, 0.0, 4.0);
  
  static getAllLevels(): ScoreLevel[] {
    return [this.EXCELLENT, this.GOOD, this.AVERAGE, this.POOR];
  }
}
