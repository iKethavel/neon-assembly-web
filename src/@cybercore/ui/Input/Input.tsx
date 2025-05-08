import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import React from 'react';
import './styles.css';

// Type for input color variants
type InputVariant = 'red' | 'yellow' | 'cyan' | 'purple' | 'blue' | 'green' | 'black' | 'white' | 'dark';

// Type for input sizes
type InputSize = 'normal' | 'long' | 'full';

// Base Input props
interface BaseInputProps {
  /**
   * Color variant for the input
   * @default 'red'
   */
  variant?: InputVariant;

  /**
   * Size of the input
   * @default 'normal'
   */
  size?: InputSize;

  /**
   * Additional CSS class
   */
  className?: string;
}

// Text Input props
interface TextInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Type of input
   * @default 'text'
   */
  type?: string;
}

// Select Input props
interface SelectInputProps extends BaseInputProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Options for the select
   */
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

// Checkbox/Radio props
interface CheckboxRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Color variant for the checkbox/radio
   * @default 'red'
   */
  variant?: InputVariant;

  /**
   * Label text
   */
  label?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * TextInput - A cyberpunk-styled text input
 */
export const TextInput: React.FC<TextInputProps> = ({
  variant = 'red',
  size = 'normal',
  className = '',
  type = 'text',
  ...props
}) => {
  const sizeClass = size === 'long'
    ? 'cyber-input-long'
    : size === 'full'
      ? 'cyber-input-full'
      : 'cyber-input';

  return (
    <div className={`cyber-input-root variant-${variant} ${className}`}>
      <div className={sizeClass}>
        <input type={type} {...props} />
      </div>
    </div>
  );
};

/**
 * SelectInput - A cyberpunk-styled select input
 */
export const SelectInput: React.FC<SelectInputProps> = ({
  variant = 'red',
  size = 'normal',
  className = '',
  options,
  ...props
}) => {
  const sizeClass = size === 'long'
    ? 'cyber-select-long'
    : size === 'full'
      ? 'cyber-select-full'
      : 'cyber-select';

  return (
    <div className={`cyber-input-root variant-${variant} ${className}`}>
      <div className={sizeClass}>
        <select {...props}>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/**
 * Checkbox - A cyberpunk-styled checkbox
 */
export const Checkbox: React.FC<CheckboxRadioProps> = ({
  variant = 'red',
  label,
  className = '',
  ...props
}) => {
  return (
    <label className={`cyber-input-root variant-${variant} ${className}`}>
      <input
        type="checkbox"
        className="cyber-check"
        {...props}
      />
      {label && <span style={{ marginLeft: '8px' }}>{label}</span>}
    </label>
  );
};

/**
 * Radio - A cyberpunk-styled radio button
 */
export const Radio: React.FC<CheckboxRadioProps> = ({
  variant = 'red',
  label,
  className = '',
  ...props
}) => {
  return (
    <label className={`cyber-input-root variant-${variant} ${className}`}>
      <input
        type="radio"
        className="cyber-radio"
        {...props}
      />
      {label && <span style={{ marginLeft: '8px' }}>{label}</span>}
    </label>
  );
};