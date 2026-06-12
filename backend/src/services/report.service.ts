import { redisPub } from "../config/redis.js";
import { Job, Queue, Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { isExistSubject } from "../enums/Subjects.js";
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { GradingConfig } from "../domains/ScoreLevels.js";

interface ReportJobData {
  subjectCode: string;
}

interface ScoreDistribution {
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

const reportQueue = new Queue<ReportJobData>("report", {
  connection: redisConnection,
});

export const addReportJob = async (job: ReportJobData) => {
  await reportQueue.add("add-report-job", job);
};

const handleJob = async (job: Job) => {
  const data = job.data;
  const { subjectCode } = data;

  const reportData: ScoreDistribution =
    await reportService.calculateForSubjectReport(subjectCode);

  const channelName = "channel:subject_data_event";
  const messagePayload = JSON.stringify({
    data: reportData,
    code: subjectCode,
  });
  await redisPub.set(`data-${subjectCode}`, JSON.stringify(reportData));
  await redisPub.publish(channelName, messagePayload);
};

const reportWorker = new Worker("report", handleJob, {
  connection: redisConnection,
});

export const reportService = {
  createReportJobs: async (subjectCodes: string[]) => {
    for (const code of subjectCodes) {
      if (isExistSubject(code)) {
        await addReportJob({
          subjectCode: code,
        });
      }
    }
  },

  calculateForSubjectReport: async (subjectCode: string) => {
    const targetField = `${subjectCode}Score`;
    const levels = GradingConfig.getAllLevels();

    const countPromises = levels.map((level) => {
      return prisma.candidateScores.count({
        where: level.getPrismaWhereClause(targetField),
      } as Prisma.CandidateScoresCountArgs);
    });

    const [excellent, good, average, poor] = await Promise.all(countPromises);

    return {
      excellent,
      good,
      average,
      poor,
    };
  },
};
