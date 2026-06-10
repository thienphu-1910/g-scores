import { Request, Response, NextFunction } from "express";
import z from "zod";

const RegistrationNumber = z.string("Not a string!").length(8).regex(/^\d+$/);

function validateRegistrationNumber(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    regisNumber
  } = req.body;
  const result = RegistrationNumber.safeParse(regisNumber);
  if (result.success) {
    next();
  } else {
    return res.status(400).json({
      errors: result.error.issues
    });
  }
}

export { validateRegistrationNumber };