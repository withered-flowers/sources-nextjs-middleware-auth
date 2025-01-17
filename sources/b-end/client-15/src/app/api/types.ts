// ?? Ini adalah type definition dari Response yang dikembalikan
// ?? Ceritanya si developer ini ingin membuat kembalian Response yang sifatnya seragam
// ?? (Dibuat jadi general agar bisa digunakan di berbagai Response)
/*
  statusCode: number; <--- harus selalu ada statusCode
  message?: string; <--- optional
  data?: T; <--- optoinal dan berupa Generic Type
  error?: string; <--- optional
*/
export type MyResponse<T> = {
	statusCode: number;
	message?: string;
	data?: T;
	error?: string;
};
