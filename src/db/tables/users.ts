import { mysqlTable, serial, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey().autoincrement(),
        emailId: varchar("email_id", { length: 256 }).notNull().unique(),
        password: varchar("password", { length: 15 }).notNull(),
        phone: varchar("phone", { length: 11 }).notNull(),
    },
    (users) => ({
        emailIndex: uniqueIndex("email_idx").on(users.emailId),
    }),
);

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;