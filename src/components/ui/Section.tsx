'use client';

import { ReactNode, useState } from 'react';
import { Plus, Minus, CaretDown } from '@phosphor-icons/react';

interface SectionProps {
  title: string;
  sectionNumber?: number;
  children: ReactNode;
  className?: string;
  onAdd?: () => void;
  onRemove?: () => void;
  defaultCollapsed?: boolean;
  dark?: boolean;
}

export default function Section({
  title,
  sectionNumber,
  children,
  className = '',
  onAdd,
  onRemove,
  defaultCollapsed = false,
  dark = false,
}: SectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section className={className}>
      <div
        className="flex items-center justify-between mb-6 cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className={dark ? 'text-[var(--color-dark-title)]' : ''}>
          {sectionNumber && (
            <span className={dark ? 'text-[var(--color-dark-paragraph)]' : 'text-[var(--color-muted)]'}>
              {sectionNumber}.{' '}
            </span>
          )}
          {title}
        </h3>

        <div className="flex items-center gap-2">
          {(onAdd || onRemove) && !isCollapsed && (
            <div className="flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
              {onRemove && (
                <button
                  onClick={onRemove}
                  className={`p-1.5 transition-colors ${
                    dark
                      ? 'text-[var(--color-dark-paragraph)] hover:text-[var(--color-error)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-error)]'
                  }`}
                >
                  <Minus weight="bold" className="w-4 h-4" />
                </button>
              )}
              {onAdd && (
                <button
                  onClick={onAdd}
                  className={`p-1.5 transition-colors ${
                    dark
                      ? 'text-[var(--color-dark-paragraph)] hover:text-[var(--color-dark-title)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-title)]'
                  }`}
                >
                  <Plus weight="bold" className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <CaretDown
            weight="bold"
            className={`w-4 h-4 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            } ${dark ? 'text-[var(--color-dark-paragraph)]' : 'text-[var(--color-muted)]'}`}
          />
        </div>
      </div>

      <div className={`collapse-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div>{children}</div>
      </div>
    </section>
  );
}
