import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SignInForm from "../../components/SignInForm";

export const Route = createFileRoute("/auth/signin")({
	component: SignInIndex,
});

function SignInIndex() {
	const navigate = useNavigate();
	return (
		<div className="flex justify-center items-center grow-1">
			<div className="flex flex-col justify-center items-center w-[50vw] max-w-[36rem] min-w-[20rem] px-8 py-8 md:py-10 border-2 border-base-300 rounded-box bg-base-100">
				<SignInForm onSignInSuccess={() => navigate({ to: "/" })} />
				<div className="divider"></div>
				<div>
					<span>Don't have an account?</span>{" "}
					<a className="link font-semibold" href="/auth/signup">
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
}
