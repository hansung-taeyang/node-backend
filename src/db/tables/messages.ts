import { json, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { images } from "./images";
import { users } from "./users";

export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey().autoincrement(),
  messageJson: json("message_json").notNull(),
  userEmailId: varchar("user_email_id", { length: 256 }).notNull().references(
    () => users.emailId,
  ),
  imageId: varchar("image_id", { length: 256 }).notNull().references(
    () => images.imageId,
  ),
});

// export const messageUserImageRelation = relations(messages, ({ one }) => ({
//   user: one(users, {
//     fields: [ messages.userEmailId ],
//     references: [ users.emailId ]
//   }),
//   image: one(images, {
//     fields: [ messages.imageId ],
//     references: [ images.imageId ]
//   })
// }));
