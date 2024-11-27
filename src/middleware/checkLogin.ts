import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../utils/config";
import { db } from "../db/db";
import { users } from "../db/tables/users";
import { eq } from "drizzle-orm";

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No token provided
 */

// Check if the user is logged in, using JWT
export const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];    
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null || token === undefined) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "No token provided" });
    }
    
    jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
        if (err !== null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
        }
        const { email } = decoded as { email: string };
        const user = await db.query.users.findFirst({
            where: eq(users.emailId, email),
        });

        req.emailId = user!.emailId;
        next();
    });
};