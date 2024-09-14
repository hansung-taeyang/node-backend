import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, conn } from "./db.js";

await migrate(db, { migrationsFolder: "./drizzle" });
await conn.end();