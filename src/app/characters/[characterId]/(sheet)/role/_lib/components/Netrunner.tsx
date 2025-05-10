'use client';

import { Tile } from '@cybercore/ui/Tile';
import React from 'react';
import Image from 'next/image';

interface NetrunnerProps {
  characterId: string;
}

export const Netrunner: React.FC<NetrunnerProps> = () => {

  return (
    <div className="grid gap-1">
      <Tile
        imageNode={<Image src="/role/netrunner-ability1.png" alt="netrunner Ability 1" width={100} height={100} />}
      >
        В наш час кожен другий вміє хакати, але мало хто вміє хакати як ти. (Маєш +500 очків до результату хакінгу.) І ти вже хакнув Neon Assembly і маєш контакти всіх відвідувачів. (в тебе в списку контактів є всі участники ларпу)
      </Tile>
    </div>
  );
};
