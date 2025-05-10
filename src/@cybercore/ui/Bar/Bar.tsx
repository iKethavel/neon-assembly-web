'use client';

import React from 'react';
import './styles.css';

export interface BarProps {
  content?: React.ReactNode;
  glitch?: boolean;
}

export const Bar: React.FC<BarProps> = ({ content, glitch }) => {
  return (
    <div className={`cyber-att-2 ${glitch ? 'cyber-glitch-2' : ''}`}>
      {content}
    </div>
  );
};