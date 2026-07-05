import React from 'react';
import { useTheme } from './useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border-3 border-black dark:border-white bg-[#ffde59] dark:bg-[#1e1e1e] text-black dark:text-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-[6px_6px_0px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000000] dark:active:shadow-[1px_1px_0px_0px_#ffffff] transition-all duration-150 flex items-center justify-center font-bold cursor-pointer"
      aria-label="Toggle Dark/Light Mode"
      title={theme === 'light' ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 stroke-[2.5]" />
      ) : (
        <Sun className="w-5 h-5 stroke-[2.5] text-[#ffde59]" />
      )}
    </button>
  );
};
