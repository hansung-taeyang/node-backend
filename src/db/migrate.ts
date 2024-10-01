import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, conn } from "./db";

(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    conn.end();
})();