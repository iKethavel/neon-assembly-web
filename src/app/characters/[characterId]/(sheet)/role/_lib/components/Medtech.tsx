'use client';

import React from 'react';
import { Tile } from '@cybercore/ui/Tile';
import Image from 'next/image';

interface MedtechProps {
  characterId: string;
}

export const Medtech: React.FC<MedtechProps> = () => {
  return (
    <div className="grid gap-1">
      <Tile
        imageNode={<Image src="/role/medtech-ability1.png" alt="Solo Ability 1" width={100} height={100} />}
      >
        <p>
          Ти латаєш рани від будь яких ножів, куль та імплантів (Будь-яку кількість одному персонажу).
        </p>
        <p>Ти можеш розпізнати, яка перед тобою наркота просто глянувши на неї. </p>
      </Tile>
    </div>
  );
};
