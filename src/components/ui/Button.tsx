import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-darkBg min-h-[44px] active:scale-95 active:shadow-inner';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-teal to-cyan-600 dark:from-brand-purple dark:to-indigo-600 text-white shadow-md shadow-brand-teal/10 dark:shadow-brand-purple/20 border border-white/10 hover:brightness-110 focus:ring-brand-teal dark:focus:ring-brand-purple',
    secondary: 'bg-white/40 dark:bg-white/5 border border-brand-teal/60 dark:border-brand-yellow/60 text-brand-teal dark:text-brand-yellow hover:bg-brand-tealLight/50 dark:hover:bg-brand-yellowLight/10 focus:ring-brand-teal dark:focus:ring-brand-yellow',
    ghost: 'bg-transparent text-brand-muted dark:text-brand-darkMuted hover:bg-black/5 dark:hover:bg-white/5 focus:ring-gray-300 dark:focus:ring-gray-700 min-h-[38px] active:scale-98'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  );
}
