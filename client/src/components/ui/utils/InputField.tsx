interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  accept?: string;
}

export default function InputField({
  id,
  name,
  type,
  autoComplete,
  placeholder,
  required = true,
  className = "",
  accept = "",
}: InputFieldProps) {
  if (type === "file")
    return (
      <input
        id={id}
        name={name}
        type={type}
        accept={accept}
        className={`h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded checked:bg-teal-500 ${className}`}
      />
    );
  if (type === "checkbox") {
    return (
      <input
        id={id}
        name={name}
        type={type}
        className={`h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded checked:bg-teal-500 ${className}`}
      />
    );
  }

  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-slate-200 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm ${className}`}
      placeholder={placeholder}
    />
  );
}
