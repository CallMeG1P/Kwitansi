import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  readOnly?: boolean;
}

export function Input({ label, readOnly, className = '', id, ...rest }: InputProps) {
  const inputCls = `input-base ${readOnly ? 'input-readonly' : ''} ${className}`;
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="label-base">{label}</label>}
      <input id={id} className={inputCls.trim()} readOnly={readOnly} {...rest} />
    </div>
  );
}
