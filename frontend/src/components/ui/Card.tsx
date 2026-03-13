import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-background-dark/50 rounded-xl border border-primary/5 p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBordered({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
