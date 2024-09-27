import express, { type Request, type Response } from "express";
import env from "./utils/config";

const server = express();

server.use(express.json());
server.use(express.urlencoded());

server.get("/", (req: Request, res: Response) => {
  res.send("Hello from back-node");
});

server.listen(parseInt(env.EXPRESS_PORT), () => {
  console.log(`Server running on http://localhost:${env.EXPRESS_PORT}`);
});
