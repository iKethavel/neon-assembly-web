'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@cybercore/ui/Button'
import type { ButtonProps } from '@cybercore/ui/Button';


interface LinkButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * URL for navigation (internal or external)
   */
  href: string;

  /**
   * Whether to open in new tab (only applies to external links)
   * @default true for external links
   */
  openInNewTab?: boolean;

  /**
   * Whether to scroll to top on navigation (only applies to internal links)
   * @default false
   */
  scrollToTop?: boolean;

  /**
   * Additional props for Next.js Link or anchor tag
   */
  linkProps?: Omit<React.ComponentProps<typeof Link>, 'href' | 'children'> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'children'>;
}

/**
 * Determines if a URL is external
 */
const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');
};

/**
 * LinkButton - A Button component that handles both internal and external navigation
 */
const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  openInNewTab,
  scrollToTop = false,
  linkProps,
  ...buttonProps
}) => {
  const isExternal = isExternalLink(href);

  // For external links
  if (isExternal) {
    // Default openInNewTab to true for external links if not specified
    const shouldOpenInNewTab = openInNewTab ?? true;

    return (
      <a
        href={href}
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        {...linkProps}
      >
        <Button {...buttonProps} />
      </a>
    );
  }

  // TODO: very bad, but we need to get the characterId from localStorage
  const adjustedLink = href.startsWith('/characters')
    ? `${href}/${localStorage.getItem('characterId')}`
    : href

  // For internal links (Next.js navigation)
  return (
    <Link
      href={adjustedLink}
      scroll={scrollToTop}
      {...linkProps}
      passHref
    >
      <Button {...buttonProps} />
    </Link>
  );
};

export default LinkButton;