// 공통 버튼 컴포넌트

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/** 버튼 변형 타입 */
type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** 버튼 크기 타입 */
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

/** 변형별 Tailwind 클래스 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 border border-transparent',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 border border-gray-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 border border-transparent',
};

/** 크기별 Tailwind 클래스 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
