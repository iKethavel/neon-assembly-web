'use client';

import React from 'react';
import { Tile } from '@cybercore/ui/Tile';
import Image from 'next/image';

interface SoloProps {
  characterId: string;
}

export const Solo: React.FC<SoloProps> = () => {
  return (
    <div className="grid gap-1">
      <Tile
        imageNode={<Image src="/role/solo-ability1.png" alt="Solo Ability 1" width={100} height={100} />}
      >
        You are already the best for me, choom!
      </Tile>
    </div>
  );
};
