import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import env from "./utils/config";
import logger from "./utils/logger";
import errorHandler from "./middleware/errorHandler";

import image from "./router/image";
import signUp from "./router/signUp";

import sample from "./router/sample";
import swagger from "./router/swagger";

const server = express();

// NOTE - Middlewares
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.static("public"));

//NOTE - Routes
server.use("/v1/createImage", createImage);
server.use("/v1/signUp", signUp);
server.use("/v1/image", image);
server.use("/sample", sample);
server.use("/docs", swagger);

server.get("/", (req: Request, res: Response) => {
  res.send("Hello from back-node");
  logger.info("This is info");
  logger.warn("This is %s", "warning");
});

// All the routes that server won't accept will be redirected to 404
server.all("*", (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send("Not found");
});

server.use(errorHandler); // Always be the last middleware

server.listen(parseInt(env.EXPRESS_PORT), () => {
  logger.info(`Server running on http://localhost:${env.EXPRESS_PORT}`);
});