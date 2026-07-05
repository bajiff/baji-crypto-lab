import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-extrabold text-sm tracking-wide text-black dark:text-white uppercase">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border-3 border-black dark:border-white bg-white dark:bg-[#121212] px-4 py-2.5 text-black dark:text-white font-medium shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffde59] dark:focus:ring-[#facc15] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_#000000] dark:focus:shadow-[4px_4px_0px_0px_#ffffff] transition-all duration-150 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
          error ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">{error}</span>}
      {!error && helperText && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">{helperText}</span>
      )}
    </div>
  );
};
