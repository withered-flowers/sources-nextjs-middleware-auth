// Lakukan import TableJokes
import TableJokes from "@/components/TableJokes";

// Mengimport component ClientFormAddJokes
import ClientFormAddJokes from "@/components/ClientFormAddJokes";

// Mengimport component ServerFormAddJokes
import ServerFormAddJokes from "@/components/ServerFormAddJokes";

// Membuat definition type untuk data yang akan di-parse
type Joke = {
	id: string;
	setup: string;
	delivery: string;
};

const fetchJokes = async () => {
	const response = await fetch("http://localhost:3001/jokes");
	const responseJson: Joke[] = await response.json();

	if (!response.ok) {
		throw new Error("Waduh Error ...");
	}

	return responseJson;
};

const DashboardJokePage = async () => {
	const jokes = await fetchJokes();

	return (
		<section>
			<h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

			{/* Memanggil component ClientFormAddJokes */}
			<section className="flex gap-4">
				<ClientFormAddJokes />
				{/* Memanggil component ServerFormAddJokes */}
				<ServerFormAddJokes />
			</section>

			{/* Gunakan component TableJokes */}
			<TableJokes jokes={jokes} />
		</section>
	);
};

export default DashboardJokePage;
