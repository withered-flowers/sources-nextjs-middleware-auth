import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// ?? Untuk membaca environment variable dari luar aplikasi nextjs
const projectDir = process.cwd();
loadEnvConfig(projectDir);

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined");
}

export default defineConfig({
	// ?? Untuk membuat file migrasi
	out: "./src/db/migrations",
	// ?? Untuk membaca schema dari database yang didefinisikan
	schema: "./src/db/schemas/index.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME,
	},
});
