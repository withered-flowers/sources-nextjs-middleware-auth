import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserTable = sqliteTable("table_users", {
	id: int().primaryKey({
		autoIncrement: true,
	}),
	username: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	superadmin: int(),
	original_name: text(),
});
