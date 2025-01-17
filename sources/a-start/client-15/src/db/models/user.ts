import { generateHash } from "@/utils/hash";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../config/drizzle";
import { UserTable } from "../schemas";
import type { TypeUserInsert } from "../schemas/type";

// Ceritanya ini untuk GET /api/users
export const getUsers = async () => {
	// ?? Di sini kita akan meng-extract password (untuk di-exclude dari hasil query)
	// ?? For the sake of security...
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...allColumns } = getTableColumns(UserTable);

	// ?? Lakukan query
	const users = await db
		.select({
			...allColumns,
		})
		.from(UserTable);

	// ?? Mengembalikan hasil query
	// ?? Sudah type-safety, sesuai hasil exclude !
	return users;
};

// Ceritanya ini untuk POST /api/users
export const createUser = async (user: TypeUserInsert) => {
	// ?? Kita akan memodifikasi user yang baru
	// ?? Karena kita butuh untuk meng-hash password
	// ?? For the sake of security...
	const modifiedUser: TypeUserInsert = {
		...user,
		password: generateHash(user.password),
	};

	const result = await db.insert(UserTable).values(modifiedUser);

	return result;
};

// Ceritanya ini untuk ambil data profile user
export const getUserById = async (id: number) => {
	const user = await db.query.UserTable.findFirst({
		where: eq(UserTable.id, id),
		columns: {
			// ?? Di sini kita akan meng-exclude password dari query
			// ?? (For the sake of security)
			password: false,
		},
	});

	return user;
};

// Ceritanya ini dipakai untuk authentikasi
export const getUserByEmail = async (email: string) => {
	// ?? Karena ini akan diperlukan untuk keperluan authentikasi nantinya
	// ?? Di sini kita tidak meng-exclude password
	const user = await db.query.UserTable.findFirst({
		where: eq(UserTable.email, email),
	});

	return user;
};
