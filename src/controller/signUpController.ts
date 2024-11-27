import { Request, Response, NextFunction } from "express";
import { SignUpRequestBody } from "../zod-schema/signUpSchema";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/tables/users";
import { StatusCodes } from "http-status-codes";

type NewUserRecord = typeof users.$inferInsert;

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

export default signUpController;
