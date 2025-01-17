// Membuat component ServerFormAddJokes

// !! Tidak digunakan lagi, karena cache sudah disabled by default
// Menggunakan revalidatePath untuk melakukan revalidate pada path tertentu
// import { revalidatePath } from "next/cache";

// Menggunakan redirect untuk melakukan pindah halaman setelah action selesai
import { redirect } from "next/navigation";

const ServerFormAddJokes = () => {
	// Server Action diharuskan berupa async function
	// Di sini juga akan menerima FormData
	const formActionHandler = async (formData: FormData) => {
		"use server";
		// Mendeklarasikan function ini sebagai server function dengan "use server"

		console.log(formData.get("setup"));
		console.log(formData.get("delivery"));

		const response = await fetch("http://localhost:3001/jokes", {
			method: "POST",
			body: JSON.stringify({
				setup: formData.get("setup"),
				delivery: formData.get("delivery"),
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const responseJson = await response.json();
		console.log(responseJson);

		// !! Tidak digunakan lagi, karena cache sudah disabled by default
		// Menggunakan revalidatePath untuk melakukan revalidate (hilang cache) pada path tertentu
		// revalidatePath("/dashboard/jokes");

		// Menggunakan redirect untuk melakukan pindah halaman setelah action selesai
		redirect("/dashboard/jokes");

		// Ingat bahwa pada saat menggunakan form html, biasanya akan melakukan refresh halaman
		// dan tidak mendapatkan response dari server
	};

	return (
		<>
			<section className="mt-4 bg-gray-200 p-4 rounded md:max-w-[25vw]">
				<p className="font-semibold mb-4">Form Add Jokes - Server Component</p>
				{/* Menggunakan action berupa formActionHandler */}
				<form action={formActionHandler} className="flex flex-col gap-2">
					<input
						className="py-2 px-4"
						type="text"
						id="setup"
						// Perhatikan di sini kita menggunakan name="setup"
						name="setup"
						placeholder="Setup"
					/>
					<input
						className="py-2 px-4"
						type="text"
						id="delivery"
						// Perhatikan di sini kita menggunakan name="delivery"
						name="delivery"
						placeholder="Delivery"
					/>
					<button
						className="bg-emerald-300 hover:bg-emerald-500 hover:text-white/90 rounded py-2 px-4 transition-colors duration-300"
						type="submit"
					>
						Add Joke
					</button>
				</form>
			</section>
		</>
	);
};

export default ServerFormAddJokes;
