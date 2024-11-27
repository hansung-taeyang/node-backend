import { type Request, type Response, type NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";

/**
 * 사용자의 Request가 유효한 형식인지 검증하는 미들웨어.
 * @param schema Request body, query, param을 검증할 zod schema
 */
export const validate =
  (schema: z.AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      logger.error('Validation error:%j', error);
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => {
          return { message: `${issue.path.join(".")} is ${issue.message}` };
        });
        res.status(StatusCodes.BAD_REQUEST).json({ message: ["Validation Error!", ...errorMessages] });
      } 
      // if not a ZodError
      else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    }
  };
