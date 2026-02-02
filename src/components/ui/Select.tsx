'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, options, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`
              w-full px-3 py-2.5 text-sm appearance-none
              bg-white border border-[var(--color-border)] rounded-lg
              text-[var(--color-title)]
              focus:border-[var(--color-title)] focus:ring-2 focus:ring-[var(--color-title)]/10
              disabled:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70
              transition-all duration-200 pr-10
              ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <CaretDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none"
            weight="bold"
          />
        </div>
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
