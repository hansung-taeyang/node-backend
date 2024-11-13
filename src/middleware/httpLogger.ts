import pinoHttp from "pino-http";
import logger from "../utils/logger";
import type { Request, Response, NextFunction } from "express";

export default function httpLogger(req: Request, res: Response, next: NextFunction) {
  pinoHttp({ logger: logger })(req, res);
  next();
}