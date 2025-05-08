'use client'

import { Button } from '@cybercore/ui/Button';
import React, { useState } from 'react';

interface ToggleProps {
  initialState?: boolean;
  onTrue?: React.ReactNode
}

const Toggle: React.FC<ToggleProps> = ({ initialState = false, onTrue }) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        className={`px-4 py-2 rounded ${isToggled ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
          }`}
      >
        {isToggled ? 'On' : 'Off'}
      </Button>

      {isToggled && onTrue}
    </>
  );
};

export default Toggle;