'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants = {
      primary: 'bg-[var(--color-title)] text-white hover:bg-[#2a2e36] focus-visible:ring-[var(--color-title)]',
      secondary: 'bg-[var(--color-surface)] text-[var(--color-title)] border border-[var(--color-border)] hover:bg-[var(--color-border-light)] focus-visible:ring-[var(--color-border)]',
      ghost: 'bg-transparent text-[var(--color-paragraph)] hover:bg-[var(--color-surface)] hover:text-[var(--color-title)]',
      danger: 'bg-[var(--color-error)] text-white hover:bg-[#dc2626] focus-visible:ring-[var(--color-error)]',
      success: 'bg-[var(--color-success)] text-white hover:bg-[#16a34a] focus-visible:ring-[var(--color-success)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
