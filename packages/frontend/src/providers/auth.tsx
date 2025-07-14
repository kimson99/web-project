import { createContext } from "react";
import useAuth from "./useAuth";

const authContext = createContext<ReturnType<typeof useAuth> | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const auth = useAuth({});
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export default AuthProvider;
