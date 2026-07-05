import React from 'react';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'cyan' | 'pink' | 'green' | 'purple';
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const bgColors = {
    default: 'bg-white dark:bg-[#1e1e1e] text-black dark:text-white',
    accent: 'bg-[#ffde59] dark:bg-[#b49b1c] text-black dark:text-white',
    cyan: 'bg-[#38bdf8] dark:bg-[#0369a1] text-black dark:text-white',
    pink: 'bg-[#f472b6] dark:bg-[#be185d] text-black dark:text-white',
    green: 'bg-[#4ade80] dark:bg-[#15803d] text-black dark:text-white',
    purple: 'bg-[#c084fc] dark:bg-[#7e22ce] text-black dark:text-white',
  };

  return (
    <div
      className={`rounded-2xl border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#ffffff] p-6 transition-all duration-200 ${bgColors[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
