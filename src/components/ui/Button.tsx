import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'success';
type Size = 'full' | 'auto' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success',
};

const sizeClasses: Record<Size, string> = {
  full: 'btn-full',
  auto: 'btn-auto',
  sm: 'btn-sm',
};

export function Button({ variant = 'primary', size = 'full', loading = false, children, disabled, className = '', ...rest }: ButtonProps) {
  const cls = `btn-base ${variantClasses[variant]} ${sizeClasses[size]} ${loading ? 'btn-loading' : ''} ${className}`;
  return (
    <button className={cls.trim()} disabled={disabled || loading} {...rest}>
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}
