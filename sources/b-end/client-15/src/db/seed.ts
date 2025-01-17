import { generateHash } from "@/utils/hash";
import { db } from "./config/drizzle";
import { UserTable } from "./schemas";
import type { TypeUserInsert } from "./schemas/type";

const seedData: TypeUserInsert[] = [
	{
		username: "developer",
		email: "developer@mail.com",
		password: generateHash("123456"),
	},
	{
		username: "admin",
		email: "admin@mail.com",
		password: generateHash("123456"),
		superadmin: 1,
	},
	{
		username: "other",
		email: "other@mail.com",
		password: generateHash("123456"),
		original_name: "Just Another",
	},
];

(async () => {
	try {
		await db.insert(UserTable).values(seedData);
		console.log("Seed data inserted");
	} catch (err) {
		console.error(err);
	}
})();
