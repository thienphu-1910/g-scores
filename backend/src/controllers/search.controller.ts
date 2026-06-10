import { Request, Response } from "express";
import { searchService } from "../services/search.service.js";

export const searchController = {
  findScoresViaRegistrationNumber: async (req: Request, res: Response) => {
    try {
      const regisNumber = String(req.params.regisNumber);
      const scores = await searchService.findScoresViaRegistrationNumber(regisNumber);

      if (!scores) {
        return res.status(400).json({
          success: false,
          message: "Invalid registration number",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Find scores successful",
        data: {
          scores,
        }
      })
    } catch (e) {
      return res.status(500).json({
        error: e
      })
    }
  }
}