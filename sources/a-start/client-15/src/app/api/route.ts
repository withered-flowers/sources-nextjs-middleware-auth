/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
// !! GET /api
export const GET = async (
	// ?? Parameter pertama di sini kita bisa menggunakan Request atau NextRequest
	// ?? Perbedaannya adalah Request adalah Web Standard Request,
	// ?? Sedangkan NextRequest adalah Request yang sudah di-extend oleh NextJS
	request: Request,
	// ?? Parameter kedua adalah Props, seperti pada NextJS pada Functional Component,
	// ?? Hanya saja di sini difokuskan kepada params
	// ?? (Untuk mengambil dynamic parameter - seperti req.params pada express)
	{
		params,
	}: {
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		params: Promise<{
			// Di sini kita bisa mendefinisikan parameter apa saja yang akan kita gunakan
			// Hanya saja karena di sini tidak ada dynamic route nya, maka sebenarnya kita belum butuh ini
		}>;
	},
) => {
	// Di sini kita bisa melakukan logic, seperti mengambil data dari DB
	// Melakukan request ke tempat lainnya
	// ?? ---
	// ?? Dan jangan lupa untuk pada akhirnya HARUS mengembalikan response
	// ?? Untuk response juga sama: Kita bisa menggunakan Response atau NextResponse
	// ?? ---
	// ?? Response adalah Web Standard Response
	// ?? NextResponse adalah Response yang sudah di-extend oleh NextJS
	// ?? ---
	// ?? Di sini yang akan dikembalikan adalah Response dari Web API
	// ?? (Standard Web API: Request untuk mendapatkan data dan Request untuk mengirimkan data)
	// ?? - https://developer.mozilla.org/en-US/docs/Web/API/Request
	// ?? - https://developer.mozilla.org/en-US/docs/Web/API/Response
	return Response.json({
		message: "Hello World",
	});
};
