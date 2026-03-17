import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={twMerge(clsx(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      ))}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
