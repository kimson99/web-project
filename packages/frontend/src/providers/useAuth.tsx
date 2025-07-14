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

interface AuthProps {
	onSignUpSuccess?: () => void;
	onSignInSuccess?: () => void;
}

const useAuth = ({ onSignUpSuccess, onSignInSuccess }: AuthProps) => {
	const [user, setUser] = useState<UserResource | undefined>(undefined);

	const { data: getMeResponse } = useQuery({
		queryKey: ["me"],
		queryFn: () => {
			return authGetMe();
		},
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	useEffect(() => {
		if (getMeResponse?.data) {
			setUser(getMeResponse.data);
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
				setUser(data.data);
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
	};
};

export default useAuth;
