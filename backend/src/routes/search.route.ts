import express from "express";
import { validateRegistrationNumber } from "../middlewares/validation.middleware.js";
import { searchController } from "../controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.get(
  "/search-scores",
  validateRegistrationNumber,
  searchController.findScoresViaRegistrationNumber,
);

export { searchRouter };
