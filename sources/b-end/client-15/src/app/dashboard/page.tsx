import { cookies } from "next/headers";

// ?? Step 7.1 - Bikin function fetch data user
const comotDataUser = async () => {
	// ?? Function ini akan melakukan fetch ke route handler /api/users
	// ?? Sambil membawa cookie token yang ada di dalam cookies

	// ?? Di sini kita akan memanggil cookies
	const cookieStore = await cookies();

	// !! (Tapi karena ini adalah Server Component, dan kita akan menggunakan fetch dari Server Side, ke API, yang sama sama ada di localhost:3000, maka kita perlu memberikan cookie dengan cara yang berbeda dari Client Side)
	const response = await fetch("http://localhost:3000/api/users", {
		headers: {
			Cookie: cookieStore.toString(),
		},
		// ?? Apabila ini berasal dari Client Component,
		// ?? Kita bisa melakukan cara yang normal: credentials: "include"
		// credentials: "include",
	});
	const responseJson = await response.json();

	return responseJson;
};

// ?? Step 7.2 - Jadikan Server Component ini async
const DashboardPage = async () => {
	// ?? Step 7.3 - Panggil function fetch data user
	const dataUser = await comotDataUser();

	return (
		<section>
			<h2 className="text-2xl font-semibold">Dashboard Page</h2>
			{/* ?? Step 7.4 - Bikin render tampilan hasilnya */}
			<pre>{JSON.stringify(dataUser, null, 2)}</pre>
		</section>
	);
};

export default DashboardPage;
