'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  variant = 'light'
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-5',
    md: 'p-7',
    lg: 'p-9',
  };

  const variantStyles = {
    light: 'bg-[var(--color-surface)] border-transparent',
    dark: 'bg-[var(--color-dark-bg)] border-transparent dark-section',
  };

  return (
    <div
      className={`
        rounded-[var(--card-radius)]
        shadow-[var(--card-shadow)]
        transition-shadow duration-200
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
