'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, unit, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--color-title)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            className={`
              w-full px-3 py-2.5 text-sm
              bg-white border border-[var(--color-border)] rounded-lg
              text-[var(--color-title)] placeholder:text-[var(--color-muted)]
              focus:border-[var(--color-title)] focus:ring-2 focus:ring-[var(--color-title)]/10
              disabled:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70
              transition-all duration-200
              ${unit ? 'pr-12' : ''}
              ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10' : ''}
              ${className}
            `}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 text-sm text-[var(--color-muted)] font-medium pointer-events-none">
              {unit}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
