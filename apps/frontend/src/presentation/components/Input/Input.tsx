import './Input.css';

export interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  // Nuevas propiedades para inputs numéricos y de fecha
  min?: string;
  max?: string;
  step?: string;
}

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  name,
  min,
  max,
  step,
}: InputProps) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        min={min}
        max={max}
        step={step}
        className={`input ${error ? 'input--error' : ''}`}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};