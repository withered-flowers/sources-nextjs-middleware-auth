import type { UserTable } from ".";

export type TypeUserSelect = typeof UserTable.$inferSelect;
export type TypeUserInsert = typeof UserTable.$inferInsert;
