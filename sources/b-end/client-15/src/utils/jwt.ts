// ?? Import jwt dan JwtPayload dari library jsonwebtoken.
import jwt, { type JwtPayload } from "jsonwebtoken";

// ?? Step 8a.1 - Import package `jose`
import * as jose from "jose";

// ?? Step 5.1 - Buat tipe data yang berfungsi sebagai payload dari JWT
export type MyJwtPayload = {
	id: number;
	email: string;
};

// ?? SECRET_KEY akan diambil dari environment variable JWT_SECRET. Jika tidak ada, maka kita akan menggunakan string "this-is-not-a-safe-key".
// ?? Kegunaan SECRET_KEY adalah sebagai kunci rahasia yang digunakan untuk mengenkripsi dan mendekripsi token.
const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";

// ?? Di sini kita menerima payload berupa object (JwtPayload) yang berisi data yang akan disimpan di dalam token.
export const createToken = (payload: JwtPayload) =>
	jwt.sign(payload, SECRET_KEY);

// ?? Di sini kita menerima token berupa string yang berisi token yang akan dibaca.
export const readPayload = (token: string) => jwt.verify(token, SECRET_KEY);

// ?? Step 8a.2 - Buat function untuk mem-verifikasi token dengan jose
// ?? Ingat bahwa verifikasi token = baca payload
// ?? Notes:
// ?? - Function ini akan menggunakan fungsi jwtVerify dari jose
// ?? - Function jwtVerify ini bisa menggunakan generic type sebagai kembalian dari payload
// ?? - Kita akan menggunakan generic type untuk memastikan bahwa payload yang kita terima adalah MyJwtPayload
// ?? - Lihat si <T> di bawah
export const readPayloadJose = async <T>(token: string) => {
	// ?? Karena di sini kita menggunakan jose, secret key yang ada harus di encode dulu
	const encodedKey = new TextEncoder().encode(SECRET_KEY);

	// ?? Kita akan menggunakan fungsi jwtVerify dari jose
	const verifyResult = await jose.jwtVerify<T>(token, encodedKey);

	// ?? Di sini kita akan mengembalikan payload dari hasil verifikasi
	return verifyResult.payload;
};
