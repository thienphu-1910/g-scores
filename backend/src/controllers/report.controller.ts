import { Request, Response } from "express";
import { redis, redisPub, redisSub } from "../config/redis.js";
import { isExistSubject } from "../enums/Subjects.js";
import { channel } from "node:diagnostics_channel";
import { reportService } from "../services/report.service.js";
import { error } from "node:console";

export const reportController = {
  createReportJobs: async (req: Request, res: Response) => {
    const subjectCodes = req.body.subjectCodes as string[];
    try {
      const response = await reportService.createReportJobs(subjectCodes);
      return res.status(200).json({
        message: "Done",
      });
    } catch (e) {
      return res.status(500).json({
        error: e,
      });
    }
  },

  sendReportResults: async (req: Request, res: Response) => {
    const subjects = req.query.subjects as string | undefined;    
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const requestedCodes: string[] = subjects ? subjects.split(",") : [];
      const pendingSubjects = new Set<string>(requestedCodes);
            
      for (const code of pendingSubjects) {
        const existingData = await redisPub.get(`data-${code}`);
        if (existingData) {
          res.write(`event: report\n`);
          res.write(
            `data: ${JSON.stringify({ code, data: JSON.parse(existingData) })}\n\n`,
          );
          pendingSubjects.delete(code);
          console.log("EXISTING DATA");
        }
      }

      if (pendingSubjects.size === 0) {
        return res.end();
      }

      const channelName = "channel:subject_data_event";
      const messageListener = (message: string) => {
        const parsedMessage = JSON.parse(message);
        const code = parsedMessage.code;
        if (pendingSubjects.has(code)) {
          res.write(`event: report\n`);          
          res.write(
            `data: ${JSON.stringify({ code, data: parsedMessage.data })}\n\n`,
          );
          pendingSubjects.delete(code);
        }

        if (pendingSubjects.size === 0) {
          redisSub.unsubscribe(channelName, messageListener);
          res.end();
        }
      };

      await redisSub.subscribe(channelName, messageListener);
      req.on("close", () => {
        redisSub.unsubscribe(channelName, messageListener);
        res.end();
      });
    } catch (e) {
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ success: false, message: "Database Unavailable" });
      } else {
        res.write(`event: error\n`);
        res.write(
          `data: ${JSON.stringify({ message: "Database Unavailable" })}\n\n`,
        );
        res.end();
      }
    }
  },
};
