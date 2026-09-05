import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'ayur';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center font-medium rounded-full';
  
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200',
    ayur: 'bg-ayur-cream text-ayur-green-950 border border-ayur-border font-semibold',
  };

  return (
    <span
      className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
