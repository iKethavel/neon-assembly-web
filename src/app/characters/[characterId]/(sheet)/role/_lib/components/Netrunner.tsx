'use client';

import { Tile } from '@cybercore/ui/Tile';
import React from 'react';

interface NetrunnerProps {
  characterId: string;
}

export const Netrunner: React.FC<NetrunnerProps> = () => {

  return (
    <div className="grid gap-1">
      <Tile
      // imageNode={<Image src="/role/media-ability2.png" alt="Solo Ability 1" width={100} height={50} />}
      >
        <div className='grid gap-1'>
          <p>Ти краще хакаєш інших - тримай +500 до результату хакінгу</p>
          <p>Кібербезпека, можливо і не друге твоє імʼя, але при спробах хакнути тебе -500</p>
        </div>
      </Tile>
    </div>
  );
};
