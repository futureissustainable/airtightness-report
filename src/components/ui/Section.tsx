'use client';

import { ReactNode } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';
import Button from './Button';

interface SectionProps {
  title: string;
  sectionNumber?: number;
  children: ReactNode;
  className?: string;
  onAdd?: () => void;
  onRemove?: () => void;
  addLabel?: string;
  removeLabel?: string;
}

export default function Section({
  title,
  sectionNumber,
  children,
  className = '',
  onAdd,
  onRemove,
  addLabel = 'Add',
  removeLabel = 'Remove',
}: SectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--color-border)]">
        <h3 className="flex items-center gap-3">
          {sectionNumber && (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-title)] text-white text-sm font-medium">
              {sectionNumber}
            </span>
          )}
          <span>{title}</span>
        </h3>
        {(onAdd || onRemove) && (
          <div className="flex items-center gap-2">
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                title={removeLabel}
                className="text-[var(--color-muted)] hover:text-[var(--color-error)]"
              >
                <Minus weight="bold" className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{removeLabel}</span>
              </Button>
            )}
            {onAdd && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onAdd}
                title={addLabel}
              >
                <Plus weight="bold" className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{addLabel}</span>
              </Button>
            )}
          </div>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
