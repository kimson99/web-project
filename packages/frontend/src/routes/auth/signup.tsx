import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SignUpForm from "../../components/SignUpForm";

export const Route = createFileRoute("/auth/signup")({
	component: SignupIndex,
});

function SignupIndex() {
	const navigate = useNavigate();
	return (
		<div className="flex justify-center items-center grow-1">
			<div className="flex flex-col justify-center items-center w-[50vw] max-w-[36rem] min-w-80 px-8 py-8 md:py-16 border-2 border-base-300 rounded-box bg-base-100">
				<SignUpForm onSignUpSuccess={() => navigate({ to: "/auth/signin" })} />
				<div className="divider mt-6"></div>
				<div>
					<span>Already have an account?</span>{" "}
					<a className="link font-semibold" href="/auth/signin">
						Sign in
					</a>
				</div>
			</div>
		</div>
	);
}
