import e, { Request, Response, NextFunction } from "express";
import { SignUpRequestBody } from "../zod-schema/signUpSchema";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/tables/users";
import { StatusCodes } from "http-status-codes";

type NewUserRecord = typeof users.$inferInsert;

const idDuplicateCheckController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const result = await db.query.users.findFirst({
      where: eq(users.emailId, email),
    });

    if (result !== undefined) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(email)) {
      return res.status(StatusCodes.OK).json({ message: "User does not exist" });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
  } catch (error) {
    console.error("Error in idDuplicateCheckController:", error);
    next(error);
  }
};

const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, phone } = req.body as SignUpRequestBody["body"];

  try {
    const result = await db.query.users.findFirst({
      where: eq(users.emailId, email)
    });

    // if user already exists, return 409 Conflict
    if (result !== undefined) {
      return res.status(StatusCodes.CONFLICT).json({ message: "User already exists" });
    }

    const newUser: NewUserRecord = {
      emailId: email,
      password: password,
      phone: phone
    };

    await db.insert(users).values(newUser);

    return res.status(StatusCodes.CREATED).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export { idDuplicateCheckController, signUpController };
