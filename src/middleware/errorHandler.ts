import { type Request, type Response, type NextFunction } from "express";
import logger from "../utils/logger";

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  logger.error(err.message);
  res.json({ message: err.message });
};