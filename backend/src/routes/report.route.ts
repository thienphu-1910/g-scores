import express from "express";
import { reportController } from "../controllers/report.controller.js";

const reportRouter = express.Router();

reportRouter.post("/trigger-reports", reportController.createReportJobs);
reportRouter.get("/stream-reports", reportController.sendReportResults)

export { reportRouter };