import {
	authAuthenticate,
	authCreate,
	authGetMe,
	authLogout,
	type AuthAuthenticateData,
	type AuthCreateData,
	type UserResource,
} from "@repo/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../config/constant";

interface AuthProps {
	onSignUpSuccess?: () => void;
	onSignInSuccess?: () => void;
}

export interface User {
	id: string;
	name: string;
	avatar: string | null;
}

const useAuth = ({ onSignUpSuccess, onSignInSuccess }: AuthProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);

	const { data: getMeResponse, isLoading: isLoadingUser } = useQuery({
		queryKey: ["me"],
		queryFn: () => {
			return authGetMe();
		},
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const handleSetUser = (data: UserResource) => {
		const avatar = data.avatar_path ? `${API_URL}/${data.avatar_path}` : null;
		setUser({ id: data.id, name: data.name, avatar });
	};

	useEffect(() => {
		if (getMeResponse?.data) {
			handleSetUser(getMeResponse.data);
		}
	}, [getMeResponse]);

	const { mutate: mutateRegister } = useMutation({
		mutationFn: (values: AuthCreateData["body"]) => {
			return authCreate({
				body: {
					name: values.name,
					email: values.email,
					password: values.password,
					password_confirmation: values.password_confirmation,
				},
			});
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
				return;
			}
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Account created");
			onSignUpSuccess?.();
		},
	});

	const { mutate: mutateLogin } = useMutation({
		mutationFn: (values: AuthAuthenticateData["body"]) => {
			return authAuthenticate({
				body: {
					email: values.email,
					password: values.password,
				},
			});
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
				return;
			}
			toast.error(error.message);
		},
		onSuccess: (data) => {
			toast.success("Account login");
			onSignInSuccess?.();
			if (data.data) {
				handleSetUser(data.data);
			}
		},
	});

	const { mutate: mutateLogout } = useMutation({
		mutationFn: () => {
			return authLogout();
		},
		onSuccess: () => {
			setUser(undefined);
		},
	});

	return {
		user,
		setUser,
		mutateRegister,
		mutateLogin,
		mutateLogout,
		isLoadingUser,
	};
};

export default useAuth;
