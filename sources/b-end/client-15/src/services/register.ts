// ?? Import Custom Type Response yang dibuat sebelumnya
import type { MyResponse } from "@/app/api/types";
import { redirect } from "next/navigation";

export const SERVER_BASE_URL = "http://localhost:3000";

// ?? Kita akan membuat suatu "server action" untuk menghandle register.
// ?? "server action" ini akan melakukan fetch ke backend, dan melakukan redirect ke "/login" apabila berhasil melakukan register. Apabila gagal pada saat fetch ke backend dan diberikan kembalian berupa error, maka kita akan redirect ke halaman register dengan URLSearchParams yang berisi error-nya.
export const serverActionHandleRegister = async (data: FormData) => {
	"use server";

	// ?? Ambil data dari form
	const username = data.get("username");
	const email = data.get("email");
	const password = data.get("password");

	// ?? Di sini kita akan menembak ke Route Handler "POST - /api/users"
	const response = await fetch(`${SERVER_BASE_URL}/api/users`, {
		method: "POST",
		// ?? Karena backendnya menerima tipe data "json" (lihat function POST pada /src/app/api/users/route.ts), maka kita harus mengirimkan bodynya dalam bentuk json juga.
		// ?? Cara untuk mengirimkan JSON adalah dengan:
		// ?? - kirim body dalam bentuk STRING dari json (JSON.stringify)
		// ?? - berikan headers Content-Type berupa json (application/json)
		body: JSON.stringify({
			username,
			email,
			password,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const responseJson: MyResponse<unknown> = await response.json();

	// !! WARNING: Bila menggunakan redirect, tidak boleh menggunakan try-catch block. Hal ini dikarenakan di dalam NextJS, redirect akan meng-throw error bernama "NEXT_REDIRECT"
	if (!response.ok) {
		const message = responseJson.error ?? "Something went wrong!";

		// ?? Harapannya di sini adalah ketika ada error, maka kita akan redirect ke halaman register dengan URLSearchParams dengan key "error" yang berisi pesan errornya, dengan asumsi bahwa error SELALU string
		return redirect(`/register?error=${message}`);
	}

	// ?? Setelah berhasil melakukan register, maka kita redirect ke halaman login
	return redirect("/login");
};
