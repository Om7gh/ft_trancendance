type ButtonProps = {
  type: "signIn" | "signUp" | "logout";
  className?: string;
  variant?: "default" | "primary" | "outline";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.ReactEventHandler;
};

export default function Button({
  type,
  className = "",
  variant = "default",
  children,
  disabled,
  onClick = () => {},
}: ButtonProps) {
  const baseStyles =
    "rounded-md font-medium transition-all px-4 py-3 cursor-pointer";
  const variantStyles = {
    default: "bg-gray-800 text-white hover:bg-gray-700",
    primary: "bg-teal-600 text-white hover:bg-teal-500",
    outline: "border border-gray-300 text-gray-300 hover:bg-gray-800",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      data-type={type}
      onClick={onClick}>
      {children}
    </button>
  );
}
