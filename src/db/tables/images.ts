import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const images = mysqlTable(
    "images",
    {
        id: serial("id").primaryKey().autoincrement(),
        imageId: varchar("image_id", { length: 256 }).notNull().unique(),
        createdAt: timestamp("created_at").defaultNow(),
        userEmailId: varchar("user_email_id", { length: 256 }).notNull().references(() => users.emailId)
    },
);

export const imageUserRelation = relations(images, ({ one }) => ({
  createdUser: one(users, {
    fields: [images.userEmailId],
    references: [users.emailId]
  })
}));