// Menambahkan perintah "use client" untuk mendeklarasikan component sebagai Client Component
"use client";

// import Link dari "next/link"
import Link from "next/link";

// Import hooks dengan nama useRouter untuk menavigasi (refresh) halaman nantinya
import { useRouter } from "next/navigation";

// Membuat definition type untuk data yang akan di-parse
type Joke = {
	id: string;
	setup: string;
	delivery: string;
};

// Membuat component TableJokes ini
const TableJokes = ({ jokes }: { jokes: Joke[] }) => {
	// Menggunakan useRouter
	const navigation = useRouter();

	// Membuat fungsi ini menjadi async karena kita akan melakukan fetch ke backend
	const buttonDeleteOnClickHandler = async (
		_event: React.MouseEvent<HTMLButtonElement>,
		id: string,
	) => {
		console.log("Delete Button Clicked for id:", id);

		// Menggunakan fetch untuk melakukan DELETE ke backend
		const response = await fetch(`http://localhost:3001/jokes/${id}`, {
			method: "DELETE",
		});
		const responseJson = await response.json();

		console.log("statusCode:", response.status, "result:", responseJson);

		// Menggunakan useRouter untuk melakukan refresh halaman
		navigation.refresh();
	};

	return (
		<>
			{/* Memindahkan table dari dashboard/jokes/page.tsx ke sini */}
			<table className="mt-4">
				<thead>
					<tr>
						<th className="p-4">No</th>
						<th className="p-4">Setup</th>
						<th className="p-4">Delivery</th>
						<th className="p-4">Action</th>
					</tr>
				</thead>
				<tbody>
					{jokes.map((joke, idx) => (
						<tr key={joke.id}>
							<td>{idx + 1}</td>
							<td>{joke.setup}</td>
							<td>{joke.delivery}</td>
							<td className="p-2">
								<Link
									href={`/dashboard/jokes/${joke.id}`}
									className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
								>
									Detail
								</Link>
							</td>
							<td className="p-2">
								<button
									type="button"
									onClick={(event) =>
										buttonDeleteOnClickHandler(event, joke.id)
									}
									className="py-2 px-4 bg-red-200 hover:bg-red-400 hover:text-white transition-colors duration-300 rounded"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default TableJokes;
