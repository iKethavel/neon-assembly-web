import React from 'react';
import './styles.css';

// Type for code block color variants
type CodeVariant = 'cyan' | 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'white';

interface CodeBlockProps {
  /**
   * Code content to display
   */
  code: React.ReactNode;

  /**
   * Whether to render as inline code
   * @default false
   */
  inline?: boolean;

  /**
   * Optional title for the code block (only for block, not inline)
   */
  title?: string;

  /**
   * Color variant for the code
   * @default 'cyan'
   */
  variant?: CodeVariant;

  /**
   * Additional CSS class
   */
  className?: string;

  tick?: boolean;
}

/**
 * CodeBlock - A cyberpunk-styled code block component
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  inline = false,
  title,
  variant = 'cyan',
  className = '',
  tick
}) => {
  if (inline) {
    return (
      <code className={`cyber-code-root cyber-code-inline variant-${variant} ${className}`}>
        {code}
      </code>
    );
  }

  return (
    <pre
      className={`cyber-code-root cyber-code-block variant-${variant} ${className}`}
      data-title={title ?? ''}
    >
      {code}
      {tick && (<span className='cyber-glitch-3'>_</span>)}
    </pre>
  );
};
