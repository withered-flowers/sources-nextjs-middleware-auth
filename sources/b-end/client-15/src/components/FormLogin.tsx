// ?? Untuk form login ini, karena kita akan menggunakan hooks untuk membuat form login yang interaktif, maka kita akan membuatnya menjadi Client Component
"use client";

// ?? Import tipe data ActionResponse dan server action serverActionLoginHandler
import {
	type ActionResponse,
	serverActionLoginHandler,
} from "@/services/login";

// ?? Import hooks useActionState (hooks baru dari React 19), yang diperlukan untuk menghandle state dari / ke server action
import { useActionState } from "react";

// ?? Di sini kita akan membuat state awal dari form login
const initialState: ActionResponse = {
	success: true,
	message: "",
};

const FormLogin = () => {
	// ?? Di sini kita akan menggunakan useActionState untuk menghandle state dari form login
	// ?? Hooks useActionState ini akan menghandle state dari form login, dan juga akan menghandle action yang akan dijalankan
	// ?? useActionState akan menerima 2 parameter:
	// ?? - action: action yang akan dijalankan
	// ?? - initialState: state awal dari form login
	// ?? useActionState akan mengembalikan 3 value:
	// ?? - currentState: state sekarang dari form login
	// ?? - actionToRun (dispatcher): fungsi action yang akan dijalankan
	// ??   - (Fungsi yang akan digunakan di dalam action form login)
	// ?? - isPending: status apakah action sedang berjalan atau tidak
	// ??   - (Bagus untuk menampilkan loading spinner)
	// !!   - Pada demo ini, isPending tidak digunakan
	const [state, actionYangAkanDijalankan] = useActionState(
		serverActionLoginHandler,
		initialState,
	);

	return (
		<form
			// ?? Di sini kita akan menggunakan action yang dihasilkan dari useActionState
			action={actionYangAkanDijalankan}
			className="flex min-w-[25vw] flex-col gap-2"
		>
			<h1 className="text-center text-3xl font-semibold text-slate-700">
				Login Page
			</h1>
			<input
				className="rounded px-4 py-2 border border-blue-300"
				type="email"
				id="email"
				name="email"
				// ?? Di sini kita akan menggunakan state.input.email untuk mengisi kembali form apabila terjadi error
				defaultValue={state?.input?.email}
				placeholder="Email"
			/>

			{/* Di sini kita akan menampikan error zod yang mungkin terjadi untuk si email */}
			{state?.error?.email && (
				<p className="rounded text-red-400 py-2 px-4 text-left">
					{state.error.email[0]}
				</p>
			)}

			<input
				className="rounded px-4 py-2 border border-blue-300"
				type="password"
				id="password"
				name="password"
				defaultValue={state?.input?.password}
				placeholder="Password"
			/>

			{/* // ?? Di sini kita akan menampikan error zod yang mungkin terjadi untuk si password */}
			{state?.error?.password && (
				<p className="rounded text-red-400 py-2 px-4 text-left">
					{state.error.password[0]}
				</p>
			)}

			<button
				type="submit"
				className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
			>
				Login
			</button>

			{/* // ?? Di sini kita akan menampilkan message yang ada ketika terjadi error */}
			{!state.success && state?.message && (
				<p className="rounded text-slate-100 py-2 px-4 bg-red-400 animate-pulse text-center">
					{state.message}
				</p>
			)}
		</form>
	);
};

export default FormLogin;
