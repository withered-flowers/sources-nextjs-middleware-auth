"use client";
// ?? Di sini kita akan menggunakan dynamic import untuk menunggu "document"
// ?? atau bahasa kerennya adalah "lazy load" untuk import lottie-react
import dynamic from "next/dynamic";

// ?? Karena di sini kita akan membungkus props dari lottie-react
// ?? Kita membutuhkan ComponentProps dari React
import type { ComponentProps } from "react";

// ?? Nah di sinilah magicnya terjadi
// ?? Kita akan import Lottie dari lottie-react ketika "document" sudah siap
// ?? di dalam DOM, "document" akan tersedia terlebih dahulu (event: DOMContentLoaded)
// ?? sebelum "window" (event: load)
const Lottie = dynamic(() => import("lottie-react"), {
	ssr: false,
});

// ?? Di sini kita akan meng-extract props dari component Lottie yang berasal dari lottie-react
type LottieProps = ComponentProps<typeof Lottie>;

// ?? Di sini kita akan menggunakan teknik Wrapper untuk "membungkus" component Lottie
const ClientLottieReact = ({ ...props }: LottieProps) => {
	return <Lottie {...props} />;
};

export default ClientLottieReact;
