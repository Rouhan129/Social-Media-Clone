import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ children, loading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer ${
        loading || props.disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}