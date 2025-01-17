// Deklarasi error sebagai Client Component
"use client";

// Di sini kita akan menggunakan useEffect untuk meng-handle error
// Karena ini menggunakan client component, kita bisa menggunakan useEffect
import { useEffect } from "react";

// Membuat component seperti biasa

// Menerima props khusus untuk error: error dan reset
// error: berupa Error dan sebuah object yang berisi digest (optional), tipe string
// reset: berupa sebuah fungsi yang akan mereturn sesuatu yang berupa void
//        - digunakan untuk me-re-render segment yang terjadi error
const DashboardErrorPage = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	/* Mensimulasikan error yang terjadi dan bisa berubah */
	useEffect(() => {
		console.log(error);
	}, [error]);

	return (
		<section>
			<p className="text-red-400 animate-pulse">
				Something wicked happened: {error.message}
			</p>
			{/* Membuat button untuk melakukan reset */}
			<button
				type="button"
				className="py-2 px-4 bg-red-400 rounded hover:text-white transition-colors duration-300"
				onClick={() => reset()}
			>
				Reset
			</button>
		</section>
	);
};

export default DashboardErrorPage;
