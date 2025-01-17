// ?? Di sini kita akan mencoba untuk menggunakan NextResponse sebagai
// ?? Pengganti dari Response yah
import { NextResponse } from "next/server";

// ?? Import fungsi dan type yang diperlukan dari `@/db/models/user.ts`
import { getUsers } from "@/db/models/user";

import { createUser } from "@/db/models/user";
// ?? Step 5.1 - Import fungsi yang diperlukan
import type { NextRequest } from "next/server";

// ?? Import type yang dibutuhkan untuk kembalian Response
import type { MyResponse } from "@/app/api/types";

import { LibsqlError } from "@libsql/client";
// ?? Step 6.1 - Import zod untuk melakukan validasi data
import { z } from "zod";

// ?? Apabila ingin menggunakan typing kembalian dari query getUsers bisa menggunakan ini
// type TypeReturnedUsers = Awaited<ReturnType<typeof getUsers>>;

// ?? Step 6.2 - Membuat schema untuk validasi data
// ?? Asumsi:
// ?? - Data yang diterima dari client adalah JSON
// ?? - Untuk data yang bisa dimasukkan adalah:
// ??   - username: string, wajib diisi
// ??   - email: string, wajib format email
// ??   - password: string, wajib diisi, minimal 6 karakter
// ??   - superuser: number (0/1) - optional
// ??   - original_name: string - optional
const CreateUserSchema = z.object({
	username: z.string().nonempty({
		// ?? Di sini kita akan memberikan pesan error apabila username kosong
		message: "Username tidak boleh kosong",
	}),
	email: z.string().email({
		// ?? Di sini kita akan memberikan pesan error apabila email tidak valid
		message: "Email tidak valid",
	}),
	password: z.string().min(6, {
		// ?? Di sini kita akan memberikan pesan error apabila password kurang dari 6 karakter
		message: "Password minimal 6 karakter",
	}),
	superuser: z
		.number()
		.min(0, {
			// ?? Di sini kita akan memberikan pesan error apabila superuser kurang dari 0
			message: "Superuser harus 0 atau 1",
		})
		.max(1, {
			// ?? Di sini kita akan memberikan pesan error apabila superuser lebih dari 1
			message: "Superuser harus 0 atau 1",
		})
		.optional(),
	original_name: z
		.string({
			// ?? Di sini kita akan memberikan pesan error apabila original_name bukan string
			message: "Nama asli harus berupa string",
		})
		.optional(),
});

// !! GET /api/users
export const GET = async () => {
	// ?? Di sini kita akan menggunakan fungsi getUsers yang sudah kita buat
	const users = await getUsers();

	// ?? Di sini kita akan mulai untuk menggunakan NextResponse yang merupakan extend dari Response
	// ?? Keuntungan menggunakan NextResponse adalah kita bisa menuliskan kembalian Response dengan lebih presisi dengan Generic Type dan memiliki beberapa method tambahan yang tidak ada di Response.
	// ?? https://nextjs.org/docs/pages/api-reference/functions/next-server#nextresponse

	// ?? Misalnya di sini kita menuliskan bahwa Response yang akan dikembalikan adalah MyResponse yang mana memiliki Generic Type unknown untuk key "data"
	// ?? Kenapa unknown? Karena kita tidak tahu (dan tidak perlu tahu) kembalian dari getUsers

	// ?? TL;DR:
	// ?? NextResponse.json sudah method terakhir, mengembalikan Response dalam bentuk JSON, dan kita tidak memproses datanya lagi, sehingga unknown pun sudah cukup
	return NextResponse.json<MyResponse<unknown>>({
		statusCode: 200,
		message: "Pong from GET /api/users !",
		// ?? Di sini kita akan mengirimkan data users
		data: users,
	});
};

// ?? Step 5.2 Menambahkan fungsi HTTP Method yang baru
// !! POST /api/users
export const POST = async (
	// ?? Sekarang kita akan menggunakan NextRequest
	req: NextRequest,
	// !! Di sini kita tidak menggunakan dynamic route, sehingga tidak perlu params
) => {
	// ?? ---
	// ?? Step 6.6 - Membungkus logic dengan try - catch block
	// ?? ---
	try {
		// ?? Step 5.3 Membaca data yang diberikan oleh client
		// ?? Asumsi:
		// ?? - data dari client berupa JSON
		const jsonData = await req.json(); // Perhatikan bahwa jsonData ini adalah "any"

		// ?? Apabila tidak ingin berasumsi, maka bisa dicek dari headers "Content-Type"
		// ?? Bila JSON = application/json
		// ?? Bila Form Standard = application/x-www-form-urlencoded
		// ?? Bila Form Data DIAWALI dengan multipart/form-data
		// !! (Khusus Form Data bukan SAMA DENGAN)

		/*
	const headerContentType = req.headers.get("Content-Type");
	
	if (headerContentType === "application/json") {
		// Bikin magic-nya di sini
	} else if (
		headerContentType === "application/x-www-form-urlencoded" ||
		headerContentType?.startsWith("multipart/form-data")
	) {
		// Bikin magic nya di sini
	}
	*/

		// ?? Step 6.3 - Validasi data yang diterima dari client
		// ?? Untuk melakukan validasi, kita akan menggunakan CreateUserSchema
		// ?? dan bisa menggunakan 2 cara:
		// ?? - CreateUserSchema.parse(jsonData) -> akan melempar error apabila data tidak valid
		// ?? - CreateUserSchema.safeParse(jsonData) -> akan mengembalikan object yang berisi data valid atau error
		// ?? Di sini kita akan menggunakan safeParse
		const parsedData = CreateUserSchema.safeParse(jsonData);

		// parsedData akan mengembalikan object dengan tipe data berikut:
		/*
			{
				success:boolean;
				data: unknown;
				error: z.ZodError | null;
			}
		*/

		// ?? Step 6.4 - Penanganan apabila data tidak valid
		if (!parsedData.success) {
			// ?? Bila tidak valid, kita akan throw error yang merupakan ZodError
			// ?? Lalu ditangkapnya dimana? Di dalam catch block
			// ?? Tapi kan belum ada, jadi kita akan buat catch blocknya
			throw parsedData.error;
		}

		// ?? Step 6.5 - Di sini kita akan mengganti passing data yang diberikan ke createUser
		// ?? Awalnya kita memberikan jsonData (any), tapi sekarang kita akan memberikan parsedData.data
		// ?? Kenapa? Karena parsedData.data sudah memiliki tipe data yang valid (sudah bukan "any" lagi)
		// // ?? Data dari hasil terimaan JSON akan kita berikan ke fungsi createUser
		const result = await createUser(parsedData.data);

		// ?? Asumsinya data sudah berhasil diterima dan berhasil diproses, maka data akan bertambah
		// ?? Sehingga kembaliannya adalah 201
		return NextResponse.json<MyResponse<unknown>>(
			{
				statusCode: 201,
				data: result,
			},
			{
				status: 201,
			},
		);
	} catch (err) {
		// ?? Step 6.7 - Penanganan error dari validasi
		// ?? Perhatikan tipe data dari err adalah unknown dan kita akan menangkap error dari zod yang merupakan ZodError

		// ?? Di sini kita akan melakukan pengecekan terlebih dahulu
		// ?? Apakah errornya merupakan ZodError?
		if (err instanceof z.ZodError) {
			console.log(err);

			// Kita akan mengambil path dan message dari error yang terjadi
			// path = key dari object yang tidak valid
			// message = pesan error yang diberikan
			const errPath = err.issues[0].path[0];
			const errMessage = err.issues[0].message;

			// ?? Pada saat terjadi error, kita harus megembalikan BadRequest (400)
			return NextResponse.json<MyResponse<never>>(
				// Data yang dikirimkan ke client
				{
					statusCode: 400,
					error: `${errPath} - ${errMessage}`,
				},
				{
					// HTTP Status Code
					status: 400,
				},
			);
		}

		// ?? Step 6.8a - Penanganan error lainnya
		// ?? Bila error dari SQLite, maka kita akan mengembalikan 400
		if (err instanceof LibsqlError) {
			// ?? Apabila error merupakan LibsqlError, maka kita akan mengembalikan 400
			return NextResponse.json<MyResponse<never>>(
				{
					statusCode: 400,
					error: err.message,
				},
				{
					status: 400,
				},
			);
		}

		// ?? Step 6.8b - Penanganan error lainnya
		// ?? Apabila error bukan dari validasi, maka kita akan mengembalikan Internal Server Error (500)
		console.log(err);

		return NextResponse.json<MyResponse<never>>(
			{
				statusCode: 500,
				message: "Internal Server Error !",
			},
			{
				status: 500,
			},
		);
	}
};
