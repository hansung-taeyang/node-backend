import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const images = mysqlTable(
    "images",
    {
        id: serial("id").primaryKey().autoincrement(),
        imageId: varchar("image_id", { length: 256 }).notNull().unique(),
        createdAt: timestamp("create_at").defaultNow(),
        userEmailId: varchar("user_email_id", { length: 256 }).references(() => users.emailId)
    },
);

export type ImageRecord = typeof images.$inferSelect;
export type NewImageRecord = typeof images.$inferInsert;