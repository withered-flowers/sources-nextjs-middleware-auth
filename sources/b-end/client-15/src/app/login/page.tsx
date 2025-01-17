// ?? Import Form Login yang dibuat
import FormLogin from "@/components/FormLogin";
import Link from "next/link";

const LoginPage = () => {
	return (
		<section className="flex h-screen w-full flex-col items-center justify-center gap-4">
			{/* // ?? Gunakan Component FormLogin di sini */}
			<FormLogin />
			<Link
				href="/register"
				className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
			>
				or do you want to register ... ?
			</Link>
		</section>
	);
};

export default LoginPage;
