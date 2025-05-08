import type { ReactNode } from 'react';
import React from 'react';
import './styles.css';

// Type for heading levels
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Type for color variants
type HeadingVariant = 'red' | 'yellow' | 'cyan' | 'purple' | 'blue' | 'green' | 'black' | 'white' | 'dark';

interface HeadingProps {
  /**
   * Content to display in the heading
   */
  children: ReactNode;

  /**
   * Heading level (h1-h6)
   * @default 2
   */
  level?: HeadingLevel;

  /**
   * Color variant for the heading
   * @default 'red'
   */
  variant?: HeadingVariant;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Optional ID for the heading
   */
  id?: string;
}

/**
 * Heading - A cyberpunk-styled heading component
 */
export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  variant = 'red',
  className = '',
  id,
}) => {
  // Combine all classes
  const headingClass = `cyber-heading-root cyber-h variant-${variant} ${className}`;

  // Render the appropriate heading level
  switch (level) {
    case 1:
      return <h1 className={headingClass} id={id}>{children}</h1>;
    case 2:
      return <h2 className={headingClass} id={id}>{children}</h2>;
    case 3:
      return <h3 className={headingClass} id={id}>{children}</h3>;
    case 4:
      return <h4 className={headingClass} id={id}>{children}</h4>;
    case 5:
      return <h5 className={headingClass} id={id}>{children}</h5>;
    case 6:
      return <h6 className={headingClass} id={id}>{children}</h6>;
    default:
      return <h2 className={headingClass} id={id}>{children}</h2>;
  }
};
