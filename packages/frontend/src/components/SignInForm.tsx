import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useAuth from "../providers/useAuth";
import CustomInputField from "./CustomInputField";

const signinSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type SignInFormValues = z.infer<typeof signinSchema>;

interface SignInFormProps {
	onSignInSuccess?: () => void;
	onSwitchToSignUp?: () => void;
}

const SignInForm = ({ onSignInSuccess, onSwitchToSignUp }: SignInFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		resolver: zodResolver(signinSchema),
	});

	const { mutateLogin } = useAuth({ onSignInSuccess });

	const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
		mutateLogin(data);
	};

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit(onSubmit)}>
				<fieldset className="fieldset">
					<legend className="fieldset-legend text-2xl mb-2">Sign in</legend>
					<CustomInputField
						labelName={"Email"}
						fieldName="email"
						placeholder="ben.dover@gmail.com"
						type="text"
						register={register}
						errorMessage={errors.email?.message}
					/>

					<CustomInputField
						labelName={"Password"}
						fieldName="password"
						type="password"
						register={register}
						errorMessage={errors.password?.message}
					/>
					<button type="submit" className="btn btn-primary mt-6">
						Continue
					</button>
				</fieldset>
			</form>
			
			{onSwitchToSignUp && (
				<div className="text-center mt-4">
					<p className="text-sm text-base-content/70">
						Don't have an account?{" "}
						<button
							onClick={onSwitchToSignUp}
							className="text-primary hover:underline font-medium"
						>
							Sign up
						</button>
					</p>
				</div>
			)}
		</div>
	);
};

export default SignInForm;
