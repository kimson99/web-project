import { useLocation, useNavigate } from "@tanstack/react-router";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import { useAuthContext } from "../providers/useAuthContext";
import Avatar from "./Avatar";

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

const SearchInput = ({ className = "" }: { className?: string }) => {
	const [searchValue, setSearchValue] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchValue.trim()) {
			navigate({ to: "/browse", search: { q: searchValue } });
		}
	};

	return (
		<form onSubmit={handleSearch} className={`input ${className}`}>
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
			<input 
				type="search" 
				placeholder="Search books & authors..." 
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
		</form>
	);
};

const MobileMenuButton = () => (
	<div className="flex">
		<div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M4 6h16M4 12h8m-8 6h16"
				/>
			</svg>
		</div>
	</div>
);

const MobileDropdown = () => {
	const location = useLocation();
	const isBrowsePage = location.pathname === '/browse';
	
	return (
		<ul
			tabIndex={0}
			className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
		>
			{!isBrowsePage && (
				<li>
					<SearchInput className="md:hidden" />
				</li>
			)}
			{navBarItems.map((item) => (
				<li key={item.id}>
					<a href={item.path}>{item.label}</a>
				</li>
			))}
		</ul>
	);
};

const DesktopNavItems = () => (
	<div id="desktop-nav-items" className="flex max-sm:hidden">
		<ul className="flex items-center justify-start gap-4">
			{navBarItems.map((item) => (
				<li key={item.id} className="whitespace-nowrap px-2">
					<a href={item.path}>{item.label}</a>
				</li>
			))}
		</ul>
	</div>
);

const UserDropdown = ({
	user,
	onSignOut,
}: {
	user: { id: string; name: string; avatar: string | null };
	onSignOut: () => void;
}) => {
	const navigate = useNavigate();
	
	const handleProfileClick = () => {
		navigate({ to: `/profiles/${user.id}` });
	};

	return (
	<div className="navbar-end mr-4">
		<div className="dropdown dropdown-end">
			<div
				className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
				role="button"
				tabIndex={1}
			>
				<Avatar name={user.name} src={user.avatar} className="w-8" />
				<div className="flex flex-col items-start max-sm:hidden">
					<span className="text-sm font-medium">{user.name}</span>
				</div>
				<FaChevronDown className="text-xs text-base-content/60" />
			</div>
			<ul
				tabIndex={1}
				className="dropdown-content menu bg-base-100 rounded-box z-[1000] w-56 p-2 shadow-lg border border-base-300 mt-2"
			>
				<li className="menu-title px-3 py-2">
					<span className="text-xs text-base-content/70">Account</span>
				</li>
				<li>
					<button 
						onClick={handleProfileClick}
						className="px-3 py-2 rounded-md hover:bg-base-200 transition-colors text-left w-full"
					>
						<span>Profile</span>
					</button>
				</li>
				<li>
					<a className="px-3 py-2 rounded-md hover:bg-base-200 transition-colors">
						<span>Settings</span>
					</a>
				</li>
				<li className="border-t border-base-300 mt-2 pt-2">
					<button 
						onClick={onSignOut}
						className="px-3 py-2 rounded-md hover:bg-error/10 hover:text-error transition-colors text-left w-full"
					>
						<span>Sign Out</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
	);
};

const GuestNavItems = () => {
	const location = useLocation();
	const isBrowsePage = location.pathname === '/browse';
	
	return (
		<div className="navbar-end gap-4">
			{!isBrowsePage && <SearchInput className="max-sm:hidden ml-4 w-96" />}
			<a href="/auth/signin" className="btn btn-primary max-sm:btn-sm">
				Sign In
			</a>
		</div>
	);
};

const NavBar = () => {
	const location = useLocation();
	const isAuthRoute = location.pathname.startsWith("/auth");
	const { user, isLoadingUser, mutateLogout } = useAuthContext();

	const handleSignOut = () => {
		mutateLogout();
	};

	return (
		<nav className="navbar bg-base-100 shadow-sm">
			<div className="navbar-start">
				<div className="dropdown">
					<MobileMenuButton />
					<MobileDropdown />
				</div>
				<a href="/" className="btn btn-ghost text-xl">
					Logo
				</a>
				<DesktopNavItems />
			</div>

			{!!user && !isLoadingUser && <UserDropdown user={user} onSignOut={handleSignOut} />}
			{!isAuthRoute && !user && <GuestNavItems />}
		</nav>
	);
};

export default NavBar;
