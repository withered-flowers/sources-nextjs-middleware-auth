// ?? Step 3.1 - Import logic server actions
import { serverActionHandleRegister } from "@/services/register";

const FormRegister = () => {
	return (
		<form
			// ?? Step 3.2 - Gunakan serverActionHandleRegister sebagai action dari form
			action={serverActionHandleRegister}
			className="flex min-w-[25vw] flex-col gap-2"
		>
			<h1 className="text-center text-3xl font-semibold text-slate-700">
				Register Page
			</h1>
			<input
				className="rounded px-4 py-2 border border-blue-300"
				type="text"
				id="username"
				name="username"
				placeholder="Username"
			/>
			<input
				className="rounded px-4 py-2 border border-blue-300"
				type="email"
				id="email"
				name="email"
				placeholder="Email"
			/>
			<input
				className="rounded px-4 py-2 border border-blue-300"
				type="password"
				id="password"
				name="password"
				placeholder="Password"
			/>
			<button
				type="submit"
				className="rounded bg-emerald-300 px-4 py-2 transition-colors duration-300 hover:bg-emerald-500 hover:text-white/90"
			>
				Register
			</button>
		</form>
	);
};

export default FormRegister;
