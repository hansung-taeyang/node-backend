import { pino } from "pino";

const options = process.env.NODE_ENV === "production" ? {
  
} : {
  level: "trace",
  transport: {
    target: "pino-pretty",
  }
};

const logger = pino(options);

export default logger;