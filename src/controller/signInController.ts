import { Request, Response, NextFunction } from "express";
import { SignInRequestBody } from "../zod-schema/signInSchema"; // 로그인 시 필요한 데이터 검증
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/tables/users";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../utils/config";

const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as SignInRequestBody["body"];

  try {
    // 1. 이메일로 사용자 조회
    const user = await db.query.users.findFirst({
      where: eq(users.emailId, email),
    });

    // 2. 사용자가 존재하지 않으면 401 Unauthorized 반환
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    // 3. 비밀번호가 암호화되지 않은 경우, 단순 문자열 비교로 검증
    if (user.password !== password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    // 4. JWT 생성 (email을 유일한 식별자로 사용)
    const token = jwt.sign(
      { email: user.emailId }, // 토큰에 포함할 정보
      config.JWT_SECRET, // 비밀 키
      { expiresIn: config.JWT_EXPIRES_IN }, // 만료 시간
    );

    // 5. 로그인 성공 응답 (토큰 반환)
    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    next(error);
  }
};

export default signInController;
