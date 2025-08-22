import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CustomToaster from "../components/CustomToaster";
import NotFound from "../components/NotFound";

export const Route = createRootRoute({
	component: () => {
		return <RootComponent />;
	},
	notFoundComponent: NotFound,
});

const RootComponent = () => {
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith("/admin");

	// For admin routes, render without navbar and footer
	if (isAdminRoute) {
		return (
			<>
				<div className="min-h-screen">
					<Outlet />
				</div>
				<CustomToaster />
				{/* <TanStackRouterDevtools /> */}
			</>
		);
	}

	// For regular routes, render with navbar and footer
	return (
		<>
			<div className="min-h-screen flex flex-col">
				<NavBar />
				<div className="flex flex-col flex-grow">
					<Outlet />
				</div>
				<Footer />
			</div>
			<CustomToaster />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
};
