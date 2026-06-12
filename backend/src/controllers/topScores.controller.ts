import { Request, Response } from "express";
import { topScoresService } from "../services/topScores.service.js";
import { SubjectGroup } from "../domains/SubjectGroup.js";
import { redisPub, redisSub } from "../config/redis.js";

export const topScoresController = {
  // --- POST API: Trigger the Calculation ---
  postSubjects: async (req: Request, res: Response): Promise<void> => {
    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      res.status(400).json({ error: "An array of subjects is required." });
      return;
    }

    try {
      await topScoresService.triggerTopScoresJob(subjects);
      res.status(202).json({
        success: true,
        message: "Top score calculation job has been queued.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to queue job" });
    }
  },

  // --- GET API: Server-Sent Events (SSE) Stream ---
  streamTopHighest: async (req: Request, res: Response): Promise<void> => {
    // 1. Setup SSE standard headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const subjectsQuery = req.query.subjects as string | undefined;
    if (!subjectsQuery) {
      res.write("event: error\ndata: Missing subjects query parameter\n\n");
      res.end();
      return;
    }

    // 2. Use domain object to parse request string into standard code
    const subjectArray = subjectsQuery.split(",");
    const group = new SubjectGroup(subjectArray);
    const cacheKey = `top-${group.groupCode}`;

    // 3. Check Redis for existing data
    const existingData = await redisPub.get(cacheKey);
    if (existingData) {
      // Data exists! Send it immediately and close the stream.
      res.write(`event: topHighest\n`);
      res.write(
        `data: ${JSON.stringify({
          code: group.groupCode,
          data: JSON.parse(existingData),
        })}\n\n`,
      );
      res.end();
      return;
    }

    // 4. If data does not exist, subscribe to await the worker's publication
    const channelName = "channel:top_highest_event";

    const messageListener = (message: string) => {
      const parsedMessage = JSON.parse(message);

      // Check if the published message matches the specific group this client requested
      if (parsedMessage.code === group.groupCode) {
        res.write(`event: topHighest\n`);
        res.write(`data: ${message}\n\n`);
        cleanup(); // Data found, close connection to prevent memory leaks
      }
    };

    // Attach the subscriber
    await redisSub.subscribe(channelName, messageListener);

    // 5. Cleanup rules
    const cleanup = () => {
      redisSub.unsubscribe(channelName, messageListener);
      res.end();
    };

    // If client disconnects manually before worker finishes
    req.on("close", cleanup);
  },
};
