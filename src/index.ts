import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import env from "./utils/config";
import logger from "./utils/logger";
import errorHandler from "./middleware/errorHandler";
import httpLogger from "./middleware/httpLogger";

import image from "./router/image";
import signUp from "./router/signUp";
import signIn from "./router/signIn";

import swagger from "./router/swagger";
import message from "./router/message";

const server = express();

// NOTE - Middlewares
if (env.NODE_ENV === "dev") {
  server.use(httpLogger);
}
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.static("public"));

//NOTE - Routes
server.use("/v1/signIn", signIn);
server.use("/v1/signUp", signUp);
server.use("/v1/image", image);
server.use("/v1/message", message);
server.use("/docs", swagger);

// All the routes that server won't accept will be redirected to 404
server.all("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("Not found");
});

server.use(errorHandler); // Always be the last middleware

server.listen(parseInt(env.EXPRESS_PORT), () => {
  logger.info(`Server running on http://localhost:${env.EXPRESS_PORT}`);
});