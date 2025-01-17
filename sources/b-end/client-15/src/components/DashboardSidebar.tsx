import Link from "next/link";

// ?? Step 6.1 - Import cookies dan redirect
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardSidebar = () => {
	return (
		<aside className="w-64 min-h-full bg-gray-100 dark:bg-zinc-800/30 p-4">
			<h2 className="text-2xl font-semibold mb-4">Navigation</h2>
			{/* Sidebar */}
			<ul>
				<li>
					<Link
						className="underline text-blue-400 hover:text-blue-600 underline-offset-4 transition-colors duration-300"
						href="/"
					>
						Home
					</Link>
				</li>
				<li>
					<Link
						className="underline text-blue-400 hover:text-blue-600 underline-offset-4 transition-colors duration-300"
						href="/about"
					>
						About
					</Link>
				</li>
				<li>
					<Link
						className="underline text-blue-400 hover:text-blue-600 underline-offset-4 transition-colors duration-300"
						href="/dashboard"
					>
						Dashboard
					</Link>
				</li>
				<li className="ml-4">
					<Link
						className="underline text-blue-400 hover:text-blue-600 underline-offset-4 transition-colors duration-300"
						href="/dashboard/jokes"
					>
						Dashboard - Jokes
					</Link>
				</li>
			</ul>

			{/* // ?? Step 6.2 - Membuat form yang berisi button submit untuk melakuan server action */}
			<form
				className="mt-8 text-center"
				// ?? Karena SideBar ini merupakan Server Component, maka tidak bisa menggunakan onSubmit, oleh karena itu, solusinya adalah menggunakan server action
				action={async () => {
					"use server";

					// ?? Menghapus cookie token bila exists
					const cookieStore = await cookies();

					if (cookieStore.get("token")) {
						cookieStore.delete("token");
					}

					// Redirect ke halaman login
					redirect("/login");
				}}
			>
				<button
					type="submit"
					className="rounded bg-blue-200 px-4 py-2 transition-colors duration-300 hover:bg-blue-400 hover:text-white"
				>
					Logout
				</button>
			</form>
		</aside>
	);
};

export default DashboardSidebar;
