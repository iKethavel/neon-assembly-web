'use client';

import React from 'react';
import './styles.css';

export interface BarProps {
  content?: React.ReactNode;
}

export const Bar: React.FC<BarProps> = ({ content }) => {
  return (
    <div className="cyber-att-2">
      {content}
    </div>
  );
};