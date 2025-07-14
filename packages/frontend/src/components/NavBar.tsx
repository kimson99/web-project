import { useLocation } from "@tanstack/react-router";
import useAuth from "../providers/useAuth";

interface NavBarItem {
	id: string;
	label: string;
	path: string;
}
const navBarItems: NavBarItem[] = [
	{
		id: "home",
		label: "Home",
		path: "/",
	},
	{
		id: "browse",
		label: "Browse",
		path: "/browse",
	},
	{
		id: "my-library",
		label: "My Library",
		path: "/my-library",
	},
];

const NavBar = () => {
	const location = useLocation();
	const isAuthRoute = location.pathname.startsWith("/auth");

	const { user } = useAuth({});

	return (
		<nav className="navbar bg-base-100 shadow-sm">
			<div className="navbar-start">
				<div className="dropdown">
					<div className="flex">
						<div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{" "}
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>{" "}
							</svg>
						</div>
						<button className="btn btn-ghost md:hidden" tabIndex={0}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{" "}
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>{" "}
							</svg>
						</button>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li>
							<label className="input md:hidden">
								<svg
									className="h-[1em] opacity-50"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<g
										strokeLinejoin="round"
										strokeLinecap="round"
										strokeWidth="2.5"
										fill="none"
										stroke="currentColor"
									>
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.3-4.3"></path>
									</g>
								</svg>
								<input type="search" required placeholder="Search" />
							</label>
						</li>
						{navBarItems.map((item) => (
							<li key={item.id}>
								<a href={item.path}>{item.label}</a>
							</li>
						))}
					</ul>
				</div>
				<a href="/" className="btn btn-ghost text-xl">
					Name
				</a>
				<div id="desktop-nav-items" className="flex max-sm:hidden">
					<ul className="flex items-center justify-start gap-4">
						{navBarItems.map((item) => (
							<li key={item.id} className="whitespace-nowrap px-2">
								<a href={item.path}>{item.label}</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			{!!user && (
				<div className="navbar-end mr-4">
					<div className="dropdown">
						<div className="avatar btn" role="button" tabIndex={1}>
							<div className="w-10 rounded-xl">
								<img alt="avatar" src={"https://picsum.photos/96/96"} />
							</div>
						</div>
						<ul
							tabIndex={1}
							className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
						>
							<li>
								<a>Item 1</a>
							</li>
							<li>
								<a>Item 2</a>
							</li>
						</ul>
					</div>
				</div>
			)}
			{!isAuthRoute && !user && (
				<div className="navbar-end gap-4">
					<label className="max-sm:hidden input ml-4 w-96">
						<svg
							className="h-[1em] opacity-50"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<g
								strokeLinejoin="round"
								strokeLinecap="round"
								strokeWidth="2.5"
								fill="none"
								stroke="currentColor"
							>
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.3-4.3"></path>
							</g>
						</svg>
						<input type="search" required placeholder="Search" />
					</label>
					<a href="/auth/signin" className="btn btn-primary max-sm:btn-sm">
						Sign In
					</a>
				</div>
			)}
		</nav>
	);
};

export default NavBar;
