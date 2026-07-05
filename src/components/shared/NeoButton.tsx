import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#ffde59] dark:bg-[#facc15] text-black hover:bg-[#ffeb85]',
    secondary: 'bg-white dark:bg-[#2a2a2a] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#383838]',
    danger: 'bg-[#ff5757] text-white hover:bg-[#ff7373]',
    success: 'bg-[#4ade80] text-black hover:bg-[#6ee7a0]',
    cyan: 'bg-[#38bdf8] text-black hover:bg-[#7dd3fc]',
    purple: 'bg-[#c084fc] text-black hover:bg-[#d8b4fe]',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm font-bold',
    md: 'py-2.5 px-5 text-base font-bold',
    lg: 'py-3.5 px-7 text-lg font-black',
  };

  return (
    <button
      disabled={disabled}
      className={`rounded-xl border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-[6px_6px_0px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000000] dark:active:shadow-[1px_1px_0px_0px_#ffffff] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000000] dark:disabled:hover:shadow-[4px_4px_0px_0px_#ffffff] ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
