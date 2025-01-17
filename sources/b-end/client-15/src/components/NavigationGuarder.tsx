// !! Jangan dibuat sebagai Client Component, karena kita perlu membaca cookie
import type { PropsWithChildren } from "react";

// ?? Import cookies dari next/headers
import { cookies } from "next/headers";

// ?? Import redirect dari next/navigation
import { redirect } from "next/navigation";

const NavigationGuarder = async ({ children }: PropsWithChildren) => {
	// ?? Kita akan membaca cookie token
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	// ?? Jika cookie token tidak ada, maka kita akan mengembalikan ke halaman login
	if (!token || token.value.length <= 0) {
		redirect("/login");
	}

	// ?? Jika cookie token ada, maka kita akan me-render children
	return <>{children}</>;
};

export default NavigationGuarder;
