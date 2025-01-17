// ?? Di sini kita akan import seluruh data schema yang ada dengan nama `schema`
import * as schema from "@/db/schemas/index";
// ?? Ini akan digunakan untuk membuat instance drizzle
import { createClient } from "@libsql/client";
// ?? Ini akan digunakan untuk membaca environment variable dari luar aplikasi nextjs
import { loadEnvConfig } from "@next/env";
// ?? Ini akan digunakan untuk membuat instance drizzle dengan libsql
import { drizzle } from "drizzle-orm/libsql";

// ?? Ini dipakai untuk membaca environment variable dari luar aplikasi nextjs
const projectDir = process.cwd();
loadEnvConfig(projectDir);

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined");
}

// ?? Ini dipakai untuk membuat koneksi ke database sqlite
// ?? Export di sini bersifat opsional, tergantung kebutuhan
export const client = createClient({
	url: process.env.DB_FILE_NAME,
});

// ?? Ini dipakai untuk membuat instance drizzle
// ?? Export di sini bersifat wajib, karena akan dipakai untuk membuat model
export const db = drizzle({
	client,
	schema,
});
