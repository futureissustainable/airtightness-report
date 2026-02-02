'use client';

import { ReactNode, useState } from 'react';
import { Plus, Minus } from '@phosphor-icons/react';

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
        <h3 style={dark ? { color: '#e6e8ea' } : undefined}>
          {title}
        </h3>

        <div className="flex items-center gap-3">
          {(onAdd || onRemove) && !isCollapsed && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
          {sectionNumber && (
            <span style={dark ? { color: '#e6e8ea' } : undefined} className="text-base font-medium text-[var(--color-title)]">
              {sectionNumber}
            </span>
          )}
        </div>
      </div>

      <div className={`collapse-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div>{children}</div>
      </div>
    </section>
  );
}
