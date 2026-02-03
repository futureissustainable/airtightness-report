'use client';

import { TextareaHTMLAttributes, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current!);

    const autoResize = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      autoResize();
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      autoResize();
      onChange?.(e);
    };

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
        <textarea
          ref={textareaRef}
          id={id}
          onChange={handleChange}
          className={`
            w-full px-3 py-2.5 text-sm resize-none overflow-hidden
            bg-white border border-[var(--color-border)]
            text-[var(--color-title)] placeholder:text-[var(--color-muted)]
            focus:border-[var(--color-title)] focus:ring-2 focus:ring-[var(--color-title)]/10
            disabled:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70
            transition-colors duration-200
            ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
