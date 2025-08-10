import { createContext, useContext } from "react";
import useAuth from "./useAuth";

export const authContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const useAuthContext = () => {
	const context = useContext(authContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};