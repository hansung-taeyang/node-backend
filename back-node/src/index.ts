import express, { type Request, type Response } from "express";
import env from "./utils/config";
import logger from "./utils/logger";

import sample from "./routes/sample";
import swagger from "./routes/swagger";

const server = express();

// NOTE - Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//NOTE - Routes
server.use("/sample", sample);
server.use("/docs", swagger);

server.get("/", (req: Request, res: Response) => {
  res.send("Hello from back-node");
  logger.info("This is info");
  logger.warn("This is %s", "warning");
});

// All the routes that server won't accept will be redirected to 404
server.all("*", (req: Request, res: Response) => {
  res.status(404).send("Not found");
});

server.listen(parseInt(env.EXPRESS_PORT), () => {
  logger.info(`Server running on http://localhost:${env.EXPRESS_PORT}`);
});