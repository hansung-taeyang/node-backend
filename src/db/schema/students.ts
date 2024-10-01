import { int, mysqlTable, serial, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

// SERIAL is an alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE.
// Students table for testing
export const students = mysqlTable(
    "students",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }),
        year: int("year"),
    },
    (students) => ({
        nameIndex: uniqueIndex("name_idx").on(students.name),
    }),
);

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;