import type { ButtonHTMLAttributes } from 'react';
import React from 'react';
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import './styles.css';

// Define button variants using cva
const buttonVariants = cva(
  "cyber-button cyber-button-root relative",
  {
    variants: {
      size: {
        small: "cyber-button-small",
        normal: "cyber-button",
        big: "cyber-button-big",
      },
      variant: {
        red: "bg-red",
        yellow: "bg-yellow",
        cyan: "bg-cyan",
        purple: "bg-purple",
        blue: "bg-blue",
        green: "bg-green",
        black: "bg-black",
        white: "bg-white",
        dark: "bg-dark",
      },
      textVariant: {
        red: "fg-red",
        yellow: "fg-yellow",
        cyan: "fg-cyan",
        purple: "fg-purple",
        blue: "fg-blue",
        green: "fg-green",
        black: "fg-black",
        white: "fg-white",
        dark: "fg-dark",
      },
      disabled: {
        true: "btn-disabled",
      }
    },
    defaultVariants: {
      size: "normal",
      variant: "red",
      textVariant: "white",
      disabled: false,
    },
  }
);

// Extract disabled from VariantProps to avoid collision
type ButtonVariantProps = Omit<VariantProps<typeof buttonVariants>, 'disabled'>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  ButtonVariantProps {
  glitchText?: string;
  tag?: string;
  text?: string;
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
}

/**
 * Button - A stylized button component with cyberpunk aesthetics
 * using class-variance-authority for managing variants
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  text,
  glitchText,
  tag,
  variant,
  textVariant,
  size,
  className = '',
  onClick,
  loading = false,
  ...props
}) => {
  const buttonContent = text ?? children;
  const isDisabled = loading || props.disabled;

  return (
    <button
      className={buttonVariants({
        variant,
        textVariant,
        size,
        disabled: isDisabled ? true : undefined,
        className
      })}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="loading-spinner">Loading...</span>
      ) : (
        <>
          <span>{buttonContent}</span>
          {glitchText && <span className={`glitchtext ${isDisabled ? "hidden" : ""}`}>{glitchText}</span>}
          {tag && <span className="tag">{tag}</span>}
        </>
      )}
    </button>
  );
};