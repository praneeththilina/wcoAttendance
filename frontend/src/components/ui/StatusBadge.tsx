interface StatusBadgeProps {
  status: 'checked_in' | 'checked_out' | 'travel' | 'not_checked_in' | 'incomplete';
}

const statusConfig = {
  checked_in: {
    class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Checked In',
  },
  checked_out: {
    class: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    label: 'Checked Out',
  },
  travel: {
    class: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Travel',
  },
  not_checked_in: {
    class: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Not Checked In',
  },
  incomplete: {
    class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Incomplete',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.class} dark:border-opacity-50`}
    >
      <span className={`size-2 rounded-full ${config.dot} mr-2`} />
      {config.label}
    </span>
  );
}
