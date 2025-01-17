// ?? Step 3.3 - Import Form Register yang dibuat
import FlashComponent from "@/components/FlashComponent";
import FormRegister from "@/components/FormRegister";
import Link from "next/link";

const RegisterPage = () => {
	return (
		<section className="flex h-screen w-full flex-col items-center justify-center gap-4">
			{/* // ?? Step 3.4 Gunakan FlashComponent di sini */}
			<FlashComponent />
			{/* // ?? Gunakan Component FormRegister di sini */}
			<FormRegister />
			<Link
				href="/login"
				className="text-blue-400 underline underline-offset-4 transition-colors duration-300 hover:text-blue-600"
			>
				or do you want to login ... ?
			</Link>
		</section>
	);
};

export default RegisterPage;
