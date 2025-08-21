import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuthContext } from "../providers/useAuthContext";
import { useEffect } from "react";
import Avatar from "../components/Avatar";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const { user, isLoadingUser } = useAuthContext();
	const navigate = useNavigate();

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
			<div className="drawer-side">
				<label
					htmlFor="admin-drawer"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<aside className="min-h-full w-80 bg-base-100">
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
					<div className="p-4">
						<ul className="menu menu-lg">
							{/* Content Management */}
							<li className="menu-title">
								<span>Content Management</span>
							</li>
							<li>
								<a href="/admin/books" className="active">
									<i className="fas fa-book"></i>
									Books
									<div className="badge badge-primary badge-sm">12</div>
								</a>
							</li>
							<li>
								<a href="/admin/authors">
									<i className="fas fa-user-edit"></i>
									Authors
								</a>
							</li>
							<li>
								<a href="/admin/reviews">
									<i className="fas fa-star"></i>
									Reviews
								</a>
							</li>

							{/* User Management */}
							<li className="menu-title mt-4">
								<span>User Management</span>
							</li>
							<li>
								<a href="/admin/users">
									<i className="fas fa-users"></i>
									Users
								</a>
							</li>

							{/* Moderation */}
							<li className="menu-title mt-4">
								<span>Moderation</span>
							</li>
							<li>
								<a href="/admin/moderation">
									<i className="fas fa-shield-alt"></i>
									Content Moderation
									<div className="badge badge-warning badge-sm">3</div>
								</a>
							</li>

							{/* System */}
							<li className="menu-title mt-4">
								<span>System</span>
							</li>
							<li>
								<a href="/admin/settings">
									<i className="fas fa-cog"></i>
									Settings
								</a>
							</li>
						</ul>

						{/* Bottom Actions */}
						<div className="mt-8 p-4 bg-base-200 rounded-lg">
							<div className="stat">
								<div className="stat-title">Books Pending</div>
								<div className="stat-value text-primary">5</div>
								<div className="stat-desc">Need approval</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
