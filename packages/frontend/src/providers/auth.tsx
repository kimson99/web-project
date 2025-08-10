import { authContext } from "./useAuthContext";
import useAuth from "./useAuth";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const auth = useAuth({});
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export default AuthProvider;
