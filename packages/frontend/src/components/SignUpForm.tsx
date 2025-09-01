import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../libs/utils';
import useAuth from '../providers/useAuth';
import CustomInputField from './CustomInputField';

const uppercaseErrorMessage =
  'Must contain at least 1 uppercase character or more';
const lowercaseErrorMessage =
  'Must contain at least 1 lowercase character or more';
const numberErrorMessage = 'Must contain at least 1 digit or more';
const specialCharacterErrorMessage =
  'Must contain at least 1 special character or more';

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Must contain at least 3 characters' })
      .max(30, { message: 'Must contain at most 20 characters' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Must contain at least 8 characters' })
      .max(20, { message: 'Must contain at most 20 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: uppercaseErrorMessage,
      })
      .refine((password) => /[a-z]/.test(password), {
        message: lowercaseErrorMessage,
      })
      .refine((password) => /[0-9]/.test(password), {
        message: numberErrorMessage,
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: specialCharacterErrorMessage,
      }),
    confirmPassword: z.string(),
  })
  .refine((args) => args.confirmPassword === args.password, {
    message: 'Confirm password does not match password',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signupSchema>;

interface SignUpFormProps {
  onSignUpSuccess?: () => void;
  className?: string;
}

const SignUpForm = ({ onSignUpSuccess, className }: SignUpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(signupSchema),
  });

  const { mutateRegister } = useAuth({ onSignUpSuccess });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    mutateRegister({
      ...data,
      password_confirmation: data.confirmPassword,
    });
  };

  return (
    <div className={cn(className, 'w-full')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-2xl mb-2">Sign up</legend>

          <CustomInputField
            labelName={'Name'}
            fieldName="name"
            placeholder="Ben Dover"
            type="text"
            isRequired={true}
            register={register}
            errorMessage={errors.name?.message}
          />

          <CustomInputField
            labelName={'Email'}
            fieldName="email"
            placeholder="ben.dover@gmail.com"
            type="text"
            register={register}
            isRequired={true}
            errorMessage={errors.email?.message}
          />

          <CustomInputField
            labelName={'Password'}
            fieldName="password"
            type="password"
            register={register}
            isRequired={true}
            errorMessage={errors.password?.message}
          />

          <CustomInputField
            labelName={'Confirm password'}
            fieldName="confirmPassword"
            type="password"
            register={register}
            isRequired={true}
            errorMessage={errors.confirmPassword?.message}
          />
          <button type="submit" className="btn btn-primary mt-6">
            Create
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default SignUpForm;
