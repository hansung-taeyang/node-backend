import { Request, Response, NextFunction } from "express";
import { SignUpRequest } from "../schema/signUpSchema";
import { eq } from "drizzle-orm";
import logger from "../utils/logger";
import { db } from "../db/db";
import { NewUser, users } from "../db/tables/users";
const signUpController = async (req: Request, res: Response, next: NextFunction) => {

  const { email, password, phone} = req.body as SignUpRequest["body"];

  try {

    const user = await db.select().from(users).where(eq(users.emailId, email));

    logger.info(email, password, phone);

    if (user.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await db.insert(users).values({
      emailId: email,
      password: password,
      phone: phone,
    } as NewUser);

    return res.status(201).json({ message: "User created successfully" });
  }
  catch (error) {
    next(error);
  }
  };

export default signUpController;