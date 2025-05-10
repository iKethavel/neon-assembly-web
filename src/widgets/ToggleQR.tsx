'use client'

import { Button } from '@cybercore/ui/Button';
import React, { useState } from 'react';
import { QRCode } from '~/widgets/QRCode';

interface ToggleProps {
  initialState?: boolean;
  link?: string;
}

export const ToggleQR: React.FC<ToggleProps> = ({ initialState = false, link }) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
  };

  const getLink = () => {
    if (link) return link

    const base = window !== undefined ? window.location.href : ''
    return `${base}/characters/${localStorage.getItem('characterId')}/nl`
  }

  return (
    <>
      <Button
        onClick={handleToggle}
        className={`px-4 py-2 rounded ${isToggled ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
          }`}
      >
        {!isToggled ? 'QR' : 'X'}
      </Button>

      {isToggled && (
        <div className="fixed inset-0 z-50 bg-black grid grid-rows-[4rem_auto]">
          <Button
            text='X'
            onClick={() => setIsToggled(false)}
          />

          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <QRCode data={getLink()} />
          </div>
        </div>
      )}
    </>
  );
};
