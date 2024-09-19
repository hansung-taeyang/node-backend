import express, { type Request, type Response } from "express";
import config from "./config";

const server = express();

server.use(express.json())

server.get("/", (req: Request, res: Response) => {
  res.send("Hello from back-node");
});

server.listen(config.EXPRESS_PORT, () => {
  console.log(`Server running on http://localhost:${config.EXPRESS_PORT}`);
});
