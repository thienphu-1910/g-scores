import express from "express";
import { topScoresController } from "../controllers/topScores.controller.js";

const topScoresRouter = express.Router();

topScoresRouter.post("/trigger-top-highest-statistic", topScoresController.postSubjects);
topScoresRouter.get("/stream-top-highest-statistic", topScoresController.streamTopHighest);

export { topScoresRouter };