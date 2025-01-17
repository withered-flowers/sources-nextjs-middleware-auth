import { cookies } from "next/headers";
import {
	type MiddlewareConfig,
	type NextRequest,
	NextResponse,
} from "next/server";
import type { MyResponse } from "./app/api/types";

// ?? Step 8b.1 - Import readPayloadJose dari utils/jwt yang sudah kita buat
import { type MyJwtPayload, readPayload, readPayloadJose } from "./utils/jwt";

// ?? Fungsi ini nanti-nya akan dijalankan pada setiap request yang memiliki path /api/
// ?? Kecuali jika path-nya adalah /api/users dan methodnya adalah POST
export const middleware = async (req: NextRequest) => {
	// ?? Ini akan dipakai untuk "debug" saja
	console.log("Pathname:", req.nextUrl.pathname);

	if (req.nextUrl.pathname === "/api/users" && req.method === "POST") {
		// ?? Apabila path-nya adalah /api/users dan method-nya adalah POST,
		// ?? Maka kita akan teruskan request saja tanpa ada logic apapun
		return NextResponse.next();
	}

	// ?? Mari kita mulai membuat logicnya di sini
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	// ?? Jika cookie token tidak ada, maka kita akan mengembalikan response dengan status code 401
	if (!token) {
		return NextResponse.json<MyResponse<never>>({
			statusCode: 401,
			error: "Unauthorized to access this resource",
		});
	}

	// ?? Apabila cookie token ada, maka kita membaca token-nya
	// ?? Ingat di sini kembalian dari cookieStore.get("token") adalah sebuah Object yang memiliki key "name" dan "value"
	// ?? Step 8b.2 - Comment line di bawh ini,
	// karena kita akan membuat yang baru dengan readPayloadJose
	// const payload = readPayload(token.value) as MyJwtPayload;

	// ?? Step 8b.3 - Kita akan menggunakan readPayloadJose
	const payload = await readPayloadJose<MyJwtPayload>(token.value);

	// ?? Umumnya setelah ini kita akan melakukan pengecekan apakah token yang ada di dalam cookies itu valid atau tidak, namun karena cookies ini awalnya diberikan dari server, maka kita akan langsung menganggap bahwa token yang ada di dalam cookies itu valid
	// ?? (Ingat: sudah http-only, secure, dan same-site)
	// ?? (Walaupun ini umumnya tergantung konsiderasi dari developer, apakah ingin melakukan validasi lagi atau langsung percaya saja dengan token yang ada di dalam cookies)

	// ?? Habis ini umumnya kita akan melakukan penambahan data ke dalam request yang kita miliki (request.user = tokenData),
	// ?? Tapi di sini kita tidak bisa memiliki data tambahan di dalam request, maka kita akan menggunakan antara cookies ATAU headers

	// ?? Ceritanya di atas kan sudah pakai cookies, nah sekarang kita akan pakai headers
	// ?? Kita akan menambahkan data payload ke dalam headers

	// !! (Seharusnya kita bisa saja mengakses req.headers untuk bisa menambahkan data payload, TAPI req.headers itu adalah sebuah object yang read-only, jadi kita tidak bisa menambahkan data ke dalam req.headers)
	// !! (Solusinya adalah kita akan membuat sebuah object baru yang berisi headers yang sudah ada, lalu kita tambahkan data payload ke dalam object tersebut)
	const newHeaders = new Headers(req.headers);

	// ?? Biasakan untuk data custom di headers menggunakan prefix "x-" (contoh: x-user)
	newHeaders.set("x-user-id", payload.id.toString());
	newHeaders.set("x-user-email", payload.email);
	// ?? Ceritanya ini data tambahan
	newHeaders.set("x-additional-data", "Hello, World!");

	// ?? Setelah selesai, kita akan melanjutkan response dengan tambahan headers yang baru
	return NextResponse.next({
		headers: newHeaders,
	});
};

export const config = {
	// ?? Middleware ini akan dijalankan pada semua request yang memiliki path /api/
	matcher: ["/api/:path*"],
} satisfies MiddlewareConfig;
