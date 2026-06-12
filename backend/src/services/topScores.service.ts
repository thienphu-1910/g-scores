import { Queue, Worker, Job } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { redisPub } from "../config/redis.js";
import { SubjectGroup } from "../domains/SubjectGroup.js";
import { TopScorerCalculator } from "../domains/TopScorerCalculator.js";

interface TopScoreJobData {
  subjects: string[];
}

// 1. Initialize Queue
const topScoresQueue = new Queue<TopScoreJobData>("top-scores", {
  connection: redisConnection,
});

// 2. Define Worker Logic
const handleTopScoreJob = async (job: Job<TopScoreJobData>) => {
  const { subjects } = job.data;

  // Use OOP Domain to handle group logic
  const group = new SubjectGroup(subjects);
  const cacheKey = `top-${group.groupCode}`;
  const channelName = "channel:top_highest_event";

  try {
    // A. Check if the job was already completed by another worker to save DB strain
    const existingData = await redisPub.get(cacheKey);
    if (existingData) {
      console.log(`Data for ${group.groupCode} already computed.`);
      return;
    }

    // B. Calculate top 10 using our OOP Strategy
    const calculator = new TopScorerCalculator(group);
    const top10 = await calculator.getTopScorers(10);

    // C. Cache the result
    const resultPayload = JSON.stringify(top10);
    await redisPub.set(cacheKey, resultPayload);

    // D. Publish the event for the SSE API
    const messagePayload = JSON.stringify({
      code: group.groupCode,
      data: top10,
    });
    await redisPub.publish(channelName, messagePayload);

    console.log(
      `Worker completed and published top scores for: ${group.groupCode}`,
    );
  } catch (error) {
    console.error(
      `Error calculating top scores for ${group.groupCode}:`,
      error,
    );
    throw error;
  }
};

// 3. Initialize Worker
const topScoresWorker = new Worker<TopScoreJobData>(
  "top-scores",
  handleTopScoreJob,
  {
    connection: redisConnection,
  },
);

// 4. Export Service Object
export const topScoresService = {
  triggerTopScoresJob: async (subjects: string[]) => {
    // Add job to BullMQ
    await topScoresQueue.add("calculate-top-scores", { subjects });
  },
};
