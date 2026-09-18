import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { value: string; label: string }[];
  children?: ReactNode;
}

export function Select({ label, options, children, className = '', id, ...rest }: SelectProps) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="label-base">{label}</label>}
      <select id={id} className={`input-base ${className}`} {...rest}>
        {options
          ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
          : children}
      </select>
    </div>
  );
}
