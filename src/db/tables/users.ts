import { int, mysqlTable, serial, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey().autoincrement(),
        emailId: varchar("emailId", { length: 256 }),
        name: varchar("password", { length: 15 }),
        phone: varchar("phone", { length: 11 }),
    },
    (users) => ({
        emailIndex: uniqueIndex("email_idx").on(users.emailId),
    }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;