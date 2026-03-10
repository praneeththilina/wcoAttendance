import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={`w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-white dark:bg-slate-900 ${className}`}
          {...props}
        />
        {label && (
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
