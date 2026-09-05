import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5',
    lg: 'text-sm sm:text-base px-6 py-3',
  };

  const variantStyles = {
    primary:
      'bg-ayur-green-900 text-white hover:bg-ayur-green-800 focus:ring-ayur-green-700 shadow-sm active:scale-[0.99]',
    secondary:
      'bg-ayur-cream text-ayur-green-950 hover:bg-ayur-sand focus:ring-ayur-green-800 border border-ayur-border active:scale-[0.99]',
    outline:
      'border border-ayur-border bg-white text-ayur-charcoal-800 hover:bg-ayur-ivory focus:ring-ayur-green-800',
    ghost:
      'text-ayur-charcoal-700 hover:bg-ayur-ivory hover:text-ayur-green-900 focus:ring-ayur-green-800',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
