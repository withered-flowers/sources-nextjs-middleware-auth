// layout ini akan meng-extend layout default dari NextJS (pages/app.tsx)
// Digunakan untuk menampilkan sidebar dan content
// import Link from "next/link";

// Import Component DashboardSidebar
// Delete component Link
import DashboardSidebar from "@/components/DashboardSidebar";

// ?? Import NavigationGuarder
import NavigationGuarder from "@/components/NavigationGuarder";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		// ?? Gunakan NavigationGuarder
		<NavigationGuarder>
			{/* // Whole Screen */}
			<section className="w-full min-h-screen flex">
				{/* Left Side */}
				{/* Mengganti aside yang ada dengan component DashboardSidebar */}
				<DashboardSidebar />

				{/* Right Side */}
				<main className="w-full h-full bg-white dark:bg-zinc-900/30 p-4">
					{/* Content */}
					{children}
				</main>
			</section>
		</NavigationGuarder>
	);
};

export default DashboardLayout;
