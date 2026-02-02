'use client';

import { ReactNode } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';

interface SectionProps {
  title: string;
  sectionNumber?: number;
  children: ReactNode;
  className?: string;
  onAdd?: () => void;
  onRemove?: () => void;
}

export default function Section({
  title,
  sectionNumber,
  children,
  className = '',
  onAdd,
  onRemove,
}: SectionProps) {
  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-baseline gap-2">
          {sectionNumber && (
            <span className="text-[var(--color-muted)]">{sectionNumber}.</span>
          )}
          {title}
        </h3>
        {(onAdd || onRemove) && (
          <div className="flex items-center gap-1">
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                title="Remove"
              >
                <Minus weight="bold" className="w-4 h-4" />
              </button>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-title)] transition-colors"
                title="Add"
              >
                <Plus weight="bold" className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
