import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuthContext } from "../providers/useAuthContext";
import { useEffect } from "react";
import Avatar from "../components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { bookIndex, userIndex } from "@repo/api";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const { user, isLoadingUser, mutateLogout } = useAuthContext();
	const navigate = useNavigate();

	// Fetch stats from existing APIs
	const { data: booksData } = useQuery({
		queryKey: ["admin-books"],
		queryFn: () => bookIndex({ query: { take: 1 } }),
		enabled: !!user?.role && user.role === "admin",
	});

	const { data: usersData } = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => userIndex({ query: { take: 1 } }),
		enabled: !!user?.role && user.role === "admin",
	});

	useEffect(() => {
		// Only run this effect when loading is complete
		if (!isLoadingUser) {
			return;
		}
		const timeout = setTimeout(() => {
			if (!user) {
				navigate({
					to: "/auth/signin",
					search: { redirect: "/admin" },
				});
			}
		}, 200);
		return () => clearTimeout(timeout);
	}, [user, isLoadingUser, navigate]);

	// Show loading while checking auth
	if (isLoadingUser) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	// Don't render anything while redirecting
	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	if (user.role !== "admin") {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="alert alert-error">
					<span>Access denied. Admin privileges required.</span>
				</div>
			</div>
		);
	}

	return (
		<div className="drawer lg:drawer-open">
			<input id="admin-drawer" type="checkbox" className="drawer-toggle" />

			{/* Page Content */}
			<div className="drawer-content flex flex-col">
				{/* Main Content */}
				<main className="flex-1 p-6 bg-base-200">
					<Outlet />
				</main>
			</div>

			{/* Sidebar */}
			<div className="drawer-side ">
				<label
					htmlFor="admin-drawer"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<aside className="flex flex-col min-h-full w-80 bg-base-100">
					{/* Admin Header */}
					<div className="bg-primary text-primary-content p-6">
						<div className="flex items-center gap-3">
							<Avatar
								name={user?.name || "Admin"}
								src={user?.avatar}
								className="w-12 h-12"
							/>
							<div>
								<h2 className="text-xl font-bold">Admin Panel</h2>
								<p className="text-sm opacity-80">Welcome, {user?.name}</p>
							</div>
						</div>
					</div>

					{/* Navigation Menu */}
					<div className="mt-4 grow-1">
						<ul className="menu w-full">
							{/* Content Management */}
							<li className="menu-title">
								<span>Content Management</span>
							</li>
							<li>
								<Link to="/admin/books" className="active">
									<FaBook />
									Books
								</Link>
							</li>
							<li>
								<Link to="/admin/users">
									<FaUser />
									Users
								</Link>
							</li>
						</ul>
					</div>
					{/* Bottom Actions */}
					<div className="mt-4 p-4 bg-base-200 rounded-lg">
						<div className="stat flex justify-between">
							<div>
								<div className="stat-title">Total Books</div>
								<div className="stat-value text-primary">
									{booksData?.data?.meta?.total || 0}
								</div>
							</div>
							<div>
								<div className="stat-title">Total Users</div>
								<div className="stat-value text-primary">
									{usersData?.data?.meta?.total || 0}
								</div>
							</div>
						</div>
					</div>

					{/* Logout Button */}
					<div className="mt-8 p-4">
						<button
							onClick={() => {
								mutateLogout();
								navigate({ to: "/" });
							}}
							className="btn btn-outline btn-error w-full"
						>
							<FaSignOutAlt />
							Logout
						</button>
					</div>
				</aside>
			</div>
		</div>
	);
}
