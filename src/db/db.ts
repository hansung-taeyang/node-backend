import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import config from "../utils/config";
import * as users from "./tables/users";
import * as images from "./tables/images";
import * as messages from "./tables/messages";

export const conn = mysql.createConnection({
    host: config.MYSQL_HOST,
    port: parseInt(config.MYSQL_PORT),
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    multipleStatements: true,
});

export const db = drizzle(conn, { 
    schema: { ...users, ...images, ...messages }, // add tables here
    mode: "default"
});