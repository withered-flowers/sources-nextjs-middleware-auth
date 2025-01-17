// ?? Berbeda dari Register yang digunakan dari Server Component, Login ini kita akan menggunakan form dalam bentuk Client Component.
// ?? Syarat untuk menggunakan Server Action di dalam Client Component:
// ?? - Harus memanggil action yang ada di file yang terpisah
// ?? - Pada file yang terpisah, harus menggunakan directive "use server" di awal file
"use server";

// ?? Berbeda dengan Register, di sini kita tidak import MyResponse karena kita tidak akan melakukan fetch ke backend kita sendiri !
import { getUserByEmail } from "@/db/models/user";
import { verifyHash } from "@/utils/hash";
import { redirect } from "next/navigation";
import { z } from "zod";

// ?? Step 5.2 - Mengimport yang dibutuhkan dari JWT
import { type MyJwtPayload, createToken } from "@/utils/jwt";
// ?? Step 5.3 - Mengimport cookies yang sudah disiapkan oleh NextJS
import { cookies } from "next/headers";

// ?? Di sini kita akan membuat tipe data yang akan digunakan untuk menghandle login
type ActionFormData = {
	email: string;
	password: string;
};

// ?? Di sini kita membuat tipe data kembalian dari ServerAction
export type ActionResponse = {
	success: boolean;
	message: string;
	error?: {
		// ?? Error yang diberikan dari zod bisa berupa array,
		// ?? Karena satu field bisa memiliki lebih dari satu error
		[K in keyof ActionFormData]?: string[];
	};
	// ?? Input ini akan digunakan untuk mengembalikan data yang diterima dari client (form)
	// ?? digunakan untuk mengisi kembali form apabila terjadi error
	input?: ActionFormData;
};

// ?? Di sini kita akan membuat schema validasi input via zod
const LoginUserSchema = z.object({
	// ?? Email wajib diisi dan harus berformat email
	email: z.string().email({
		message: "Email tidak valid",
	}),
	// ?? Karena ini keperluan login, maka password wajib diisi
	// ?? Misalnya di sini kita berbaik hati untuk memberikan info password minimal 6 karakter
	// !! WARNING: Don't do this on prod !
	password: z.string().min(6, {
		message: "Password minimal 6 karakter",
	}),
});

// ?? Kita akan membuat suat "action" untuk menghandle login.
// ?? "action" ini akan melakukan call ke database, memeriksa apakah user dengan username dan password yang diberikan ada di database atau tidak. Apabila gagal, maka kita akan berikan pesan error "Invalid credentials", apabila berhasil, maka kita akan redirect ke halaman "/dashboard".

// ?? Berbeda dengan action yang sebelumnya yang hanya memerlukan payload (data) dari form saja, karena di sini kita akan menggunakan Client Component untuk menghandle action via hooks, maka kita memerlukan 2 parameter di dalam server action ini, yaitu:
// ?? - prevState = state sebelumnya, bisa berupa ActionResponse atau belum ada (null)
// ?? - payload = data yang diterima dari form, berupa FormData
export const serverActionLoginHandler = async (
	_stateSebelumnya: ActionResponse | null,
	payload: FormData,
): Promise<ActionResponse> => {
	// ?? Ambil data dari form, kita jadikan sebagai string
	const rawData: ActionFormData = {
		email: payload.get("email") as string,
		password: payload.get("password") as string,
	};

	// ?? Step 5.4 - Menggunakan cookies
	// ?? Sejak NextJS v15, cookies ini sudah bersifat async, sehingga kita harus menggunakan await
	const cookieStore = await cookies();

	// ?? Validasi data yang diterima dari client
	// ?? Di sini kita juga masih akan menggunakan safeParse
	const parsedData = LoginUserSchema.safeParse(rawData);

	// ?? Di sini kita akan melakukan pengecekan apakah data yang diterima valid atau tidak
	if (!parsedData.success) {
		// ?? Di sini kita akan mengembalikan data ketika terjadi error
		return {
			success: false,
			message: "Please check your input",
			// ?? Kita akan mengembalikan error yang diberikan oleh zod yang berupa fieldErrors
			error: parsedData.error.flatten().fieldErrors,
			// ?? Karena ini adalah error yang "sederhana" (password minimal 6 karakter), maka kita akan mengembalikan input yang diterima dari client, supaya form bisa diisi kembali.
			input: rawData,
		};
	}

	// ?? Di sini kita akan membuat logic yang digunakan untuk login
	// ?? Memeriksa apakah user dengan email yang diberikan ada di database atau tidak
	const foundUser = await getUserByEmail(parsedData.data.email);

	if (!foundUser || !verifyHash(parsedData.data.password, foundUser.password)) {
		return {
			success: false,
			message: "Invalid credentials",
			// ?? Karena ini adalah error yang berat (salah username / password), maka kita tidak akan mengembalikan input yang diterima dari client
		};
	}

	// ?? Step 5.5 - Membuat payload yang akan disiapkan untuk JWT
	const jwtPayload: MyJwtPayload = {
		id: foundUser.id,
		email: foundUser.email,
	};

	// ?? Step 5.6 - Membuat token berdasarkan payload yang sudah disiapkan
	const token = createToken(jwtPayload);

	// ?? Step 5.7 - Menyimpan token ke dalam cookies
	// ?? Kita akan menggunakan cookieStore yang sudah disiapkan oleh NextJS
	// ?? Kita akan menyimpan token ke dalam cookie dengan nama "token"
	cookieStore.set("token", token, {
		// ?? Kita akan mengatur cookie ini agar lebih aman (tidak dapat diakses oleh JavaScript), untuk menhindari XSS
		httpOnly: true,
		// ?? Kita akan mengatur cookie ini agar hanya bisa diakses oleh HTTPS
		// !! Di sini kita akan menggunakan logic untuk mematikan secure bila tidak dalam production
		secure: process.env.NODE_ENV === "production",
		// ?? Kita akan mengatur cookie ini akan expired dalam 1 hari
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
		// ?? Kita akan mengatur cookie ini agar hanya bisa diakses oleh domain yang sama
		sameSite: "strict",
	});

	// ?? Apabila berhasil, maka kita akan redirect ke halaman "/dashboard"
	redirect("/dashboard");
};
