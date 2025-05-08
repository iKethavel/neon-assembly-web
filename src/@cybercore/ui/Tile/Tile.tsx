import type { ReactNode } from 'react';
import React from 'react';
import './styles.css';

// Type for color variants
type TileVariant = 'red' | 'yellow' | 'cyan' | 'purple' | 'blue' | 'green' | 'black' | 'white' | 'dark';

// Type for size variants
type TileSize = 'small' | 'normal' | 'big';

interface TileProps {
  /**
   * Content to display in the tile
   */
  children: ReactNode;

  /**
   * Optional label to display
   */
  label?: string;

  /**
   * Optional image source
   */
  imageSrc?: string;

  /**
   * Image alt text (required if imageSrc is provided)
   */
  imageAlt?: string;

  imageClassname?: string;

  /**
   * Color variant for the tile
   * @default 'white'
   */
  variant?: TileVariant;

  /**
   * Size of the tile
   * @default 'normal'
   */
  size?: TileSize;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  imageNode?: ReactNode
}

/**
 * Tile - A cyberpunk-styled content tile component
 */
export const Tile: React.FC<TileProps> = ({
  children,
  label,
  imageSrc,
  imageAlt = '',
  imageClassname = '',
  variant = 'white',
  size = 'normal',
  className = '',
  onClick,
  imageNode,
}) => {
  // Determine the appropriate CSS class based on size
  const sizeClass = size === 'small'
    ? 'cyber-tile-small'
    : size === 'big'
      ? 'cyber-tile-big'
      : 'cyber-tile';

  return (
    <div
      className={`cyber-tile-root ${sizeClass} variant-${variant} ${className}`}
      onClick={onClick}
    >
      {imageSrc && !imageNode && (
        <img src={imageSrc} alt={imageAlt} className={imageClassname} />
      )}

      {imageNode}

      {label && (
        <label>{label}</label>
      )}

      <div className="cyber-tile-content">
        {children}
      </div>
    </div>
  );
};
