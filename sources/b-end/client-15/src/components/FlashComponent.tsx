// ?? Karena di sini kita akan menggunakan hooks useSearchParams, kita harus menggunakan Client Component
"use client";

// ?? Import useSearchParams
import { useSearchParams } from "next/navigation";

const FlashComponent = () => {
	// ?? Ingat: Hooks hanya boleh digunakan di dalam functional component
	const searchParams = useSearchParams();

	// ?? Ambil error message dari URLSearchParams
	// ?? Asumsi: error message di dalam URLSearchParams bernama "error"
	const errorMessage = searchParams.get("error");

	return (
		<>
			{/* // ?? Render Component hanya bila errorMessage ada */}
			{errorMessage && (
				<p className="animate-pulse rounded bg-red-400 px-4 py-2 text-center text-white">
					{errorMessage}
				</p>
			)}
		</>
	);
};

export default FlashComponent;
