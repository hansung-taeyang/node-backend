import {defineConfig} from "drizzle-kit";
import config from "./src/utils/config";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: config.MYSQL_HOST,
    port: parseInt(config.MYSQL_PORT),
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
  },
});