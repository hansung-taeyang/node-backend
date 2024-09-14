import {defineConfig} from "drizzle-kit";
import dotenvx from "@dotenvx/dotenvx"
import config from "./src/config.js";

dotenvx.config();

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
  },
});