import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  accept?: string;
  icon?: React.ReactNode;
}

export default function InputField({
  id,
  name,
  type,
  autoComplete,
  placeholder,
  required = true,
  className = '',
  accept = '',
  icon,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  if (type === 'file') {
    return (
      <div className="relative group">
        <input
          id={id}
          name={name}
          type={type}
          accept={accept}
          className="hidden"
        />
        <label
          htmlFor={id}
          className={`flex items-center justify-center gap-3 px-6 py-3 
            bg-slate-900/50 border-2 border-violet-500/30 
            text-slate-300 font-medium cursor-pointer
            hover:border-neon hover:bg-slate-800/50 
            hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]
            transition-all duration-300 
            group-hover:text-white ${className}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span>Choose file</span>
        </label>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="relative group">
        <input id={id} name={name} type={type} className="peer sr-only" />
        <label
          htmlFor={id}
          className={`flex items-center justify-center w-6 h-6 
            bg-slate-900/50 border-2 border-violet-500/50 cursor-pointer
            hover:border-neon hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]
            peer-checked:bg-gradient-to-br peer-checked:from-violet-500 peer-checked:to-neon
            peer-checked:border-transparent
            transition-all duration-300 ${className}`}
        >
          <svg
            className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
      </div>
    );
  }

  if (type === 'password') {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 text-xl z-10">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-12 py-3 
            bg-slate-900/50 backdrop-blur-sm
            border-2 border-violet-500/30
            text-slate-200 placeholder-slate-500 
             outline-none
            focus:border-neon focus:shadow-[0_0_20px_rgba(139,92,246,0.4)]
            transition-all duration-300
            ${isFocused ? 'border-neon' : ''}
            ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-neon transition-colors z-10"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="text-2xl" />
          ) : (
            <AiOutlineEye className="text-2xl" />
          )}
        </button>

        <div
          className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-neon opacity-0 blur-md -z-10 transition-opacity duration-300
            ${isFocused ? 'opacity-30' : 'group-hover:opacity-20'}`}
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 text-xl z-10">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 
          bg-slate-900/50 backdrop-blur-sm
          border-2 border-violet-500/30
          text-slate-200 placeholder-slate-500 
           outline-none
          focus:border-neon focus:shadow-[0_0_20px_rgba(139,92,246,0.4)]
          transition-all duration-300
          ${isFocused ? 'border-neon' : ''}
          ${className}`}
      />

      <div
        className={`absolute inset-0  bg-gradient-to-r from-violet-500 to-neon opacity-0 blur-md -z-10 transition-opacity duration-300
          ${isFocused ? 'opacity-30' : 'group-hover:opacity-20'}`}
      />
    </div>
  );
}
