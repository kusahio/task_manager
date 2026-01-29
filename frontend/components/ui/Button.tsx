'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  isLoading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
}

export default function Button({
  children,
  isLoading,
  variant = 'primary',
  className = '',
  disabled,
  ...props
} : ButtonProps) {
  const baseStyles = 'cursor-pointer px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}