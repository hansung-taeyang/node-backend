import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import config from "../config.js";

export const conn = await mysql.createConnection({
    host: config.MYSQL_HOST,
    port: parseInt(config.MYSQL_PORT),
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    multipleStatements: true,
});

export const db = drizzle(conn);