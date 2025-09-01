import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface CustomInputFieldProps<T extends FieldValues> {
  labelName: string;
  fieldName: Path<T>;
  type: React.HTMLInputTypeAttribute;
  register: UseFormRegister<T>;
  isRequired?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

const CustomInputField = <T extends FieldValues>({
  labelName,
  fieldName,
  errorMessage,
  placeholder,
  isRequired,
  type,
  register,
}: CustomInputFieldProps<T>) => {
  return (
    <>
      <label className="fieldset-label">
        {`${labelName}${isRequired ? '*' : ''}`}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="input w-full placeholder:opacity-50"
        {...register(fieldName)}
      />
      {errorMessage && <div className="text-error">{errorMessage}</div>}
    </>
  );
};

export default CustomInputField;
