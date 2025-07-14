import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Import the generated route tree
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { client } from "../../api/generated/client.gen";
import AuthProvider from "./providers/auth";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const baseURL = "http://localhost:8000";

client.setConfig({
	baseURL: `${baseURL}/api`,
	withXSRFToken: true,
	withCredentials: true,
	throwOnError: true,
});

client.instance.interceptors.request.use((config) => {
	if (
		(config.method === "post" ||
			config.method === "put" ||
			config.method === "delete") &&
		Cookies.get("XSRF-TOKEN")
	) {
		return client
			.get({ baseURL: baseURL, url: "/sanctum/csrf-cookie" })
			.then(() => config);
	}
	return config;
}, null);

const queryClient = new QueryClient();
// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</QueryClientProvider>
		</StrictMode>
	);
}
