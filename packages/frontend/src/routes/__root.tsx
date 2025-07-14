import { createRootRoute, Outlet } from "@tanstack/react-router";
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
			<TanStackRouterDevtools />
		</>
	);
};
