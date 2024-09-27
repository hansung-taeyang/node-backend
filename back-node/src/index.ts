import express, { type Request, type Response } from "express";
import env from "./utils/config";
import logger from "./utils/logger";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req: Request, res: Response) => {
  res.send("Hello from back-node");
  logger.info("This is info");
  logger.warn("This is %s", "warning");
});

server.all("*", (req: Request, res: Response) => {
  res.status(404).send("Not found");
});

server.listen(parseInt(env.EXPRESS_PORT), () => {
  logger.info(`TEST: ${env.TEST}`);
  logger.info(`Server running on http://localhost:${env.EXPRESS_PORT}`);
});
