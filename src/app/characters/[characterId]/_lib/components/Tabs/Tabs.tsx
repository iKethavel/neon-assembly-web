'use client';

import React, { useState, useEffect } from 'react';
import './styles.css';
import Link from 'next/link';
import Image from 'next/image';

// Type for color variants
type TabsVariant = 'red' | 'yellow' | 'cyan' | 'purple' | 'blue' | 'green' | 'black' | 'white' | 'dark';

interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * The label shown on the tab
   */
  label: string;

  icon?: string;


  href: string;

  /**
   * Whether this tab is disabled
   */
  disabled?: boolean;
}

interface TabsProps {
  /**
   * The tabs to display
   */
  tabs: TabItem[];

  /**
   * The ID of the initially active tab
   */
  defaultTab?: string;

  /**
   * Color variant for the tabs
   * @default 'red'
   */
  variant?: TabsVariant;

  /**
   * Callback when a tab is selected
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Additional CSS class for the tabs container
   */
  className?: string;
}

/**
 * Tabs - A cyberpunk-styled tabs component
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'red',
  onTabChange,
  className = '',
}) => {
  // Use the first non-disabled tab as default if not specified
  const getInitialTab = (): string => {
    if (defaultTab) {
      const tabExists = tabs.some(tab => tab.id === defaultTab && !tab.disabled);
      if (tabExists) return defaultTab;
    }

    if (typeof window !== 'undefined') {
      const hrefTab = window.location.pathname.split('/').reverse().at(0)

      const firstEnabledTab = tabs.find(tab => tab.href === hrefTab);
      if (firstEnabledTab) {
        return firstEnabledTab.id;
      }
    }

    // Find first non-disabled tab
    const firstEnabledTab = tabs.find(tab => !tab.disabled);
    return firstEnabledTab ? firstEnabledTab.id : tabs[0]?.id ?? '';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);

  // Update active tab if defaultTab prop changes
  useEffect(() => {
    if (defaultTab) {
      const tabExists = tabs.some(tab => tab.id === defaultTab && !tab.disabled);
      if (tabExists) setActiveTab(defaultTab);
    }
  }, [defaultTab, tabs]);

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  return (
    <div className={`cyber-tabs-root variant-${variant} ${className}`}>
      <div className="cyber-tabs-list">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
          >
            <button
              className={`cyber-tab relative ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              role="tab"
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.icon ? <Image src={tab.icon} alt={tab.label} width={40} height={40} objectFit='cover' className='grayscale' /> : tab.label}
            </button>
          </Link>
        ))}
      </div>

    </div>
  );
};
