// ?? Di sini kita masih akan menggunakan NextResponse, dan menggunakan NextRequest juga
import { type NextRequest, NextResponse } from "next/server";

// ?? Import type yang dibutuhkan untuk kembalian Response
import type { MyResponse } from "@/app/api/types";

// ?? Import function getUserById yang sudah kita buat sebelumnya
import { getUserById } from "@/db/models/user";

// ?? Apabila ingin menggunakan typing kembalian dari query getUserById bisa menggunakan ini
// type TypeReturnedUser = Awaited<ReturnType<typeof getUserById>>;

// !! GET /api/users/[id]
export const GET = async (
	// ?? Untuk ini kita bisa menggunakan Request ataupun NextRequest
	// ?? Karena di sini kita belum menggunakan si requestnya, jangan lupa gunakan underscore
	// ?? (Untuk menandakan bahwa kita tidak akan menggunakan parameter tersebut)
	_req: NextRequest,
	// ?? Karena sekarang kita sudah memiliki dynamic route-nya,
	// ?? Maka sekarang kita akan menggunakan Props yang memiliki key params
	{
		params,
	}: {
		// ?? Di sini kita akan menggunakan dynamic route, yaitu id
		// ?? Karena id adalah string, maka kita akan menggunakan string

		// ?? Perhatikan pada NextJS v15, params ini sudah berupa Promise
		params: Promise<{
			id: string;
		}>;
	},
) => {
	// ?? Karena params ini sudah berupa Promise, maka pada saat mengambil paramsnya kita harus menggunakan await
	// ?? Akan menghasilkan sebuah object yang di dalamnya memiliki key id, sehingga bisa kita de-structure untuk mendapatkan id
	const { id } = await params;

	const user = await getUserById(Number(id));

	// ?? Apabila data tidak ditemukan, kita akan mengembalikan response 404
	// ?? Pada saat data kosong, maka berupa null, sehingga bisa kita gunakan untuk mengecek apakah falsy
	if (!user) {
		// ?? Nah ketika data tersebut tidak ada, maka harapannya adalah data tidak boleh ada kan?
		// ?? Sehingga di sini kita akan menggunakan Generic Type untuk si data adalah "never"
		return NextResponse.json<MyResponse<never>>(
			{
				// ?? Ini hanyalah statusCode yang berupa data JSON
				statusCode: 404,
				error: "Data user tidak ditemukan",
			},
			{
				// ?? Ini merupakan status code yang diberikan sebagai HTTP Status Code
				status: 404,
			},
		);
	}

	// Bila di temukan, kita akan mengembalikan response 200
	return NextResponse.json<MyResponse<unknown>>({
		statusCode: 200,
		// // ?? Di sini kita akan mengembalikan id yang kita dapatkan dari params
		// Sekarang kita akan mengirimkan data user yang ditemukan
		data: user,
	});
};
