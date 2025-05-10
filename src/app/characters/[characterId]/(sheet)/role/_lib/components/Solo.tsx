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
        Ти вже знаєш шо ти вмієш, чумба. Коли дістають пушки, всі в кімнаті знають що ти найбільша загроза. (У тебе найкраща бойова колода). Твої рефлекси реагують на найменші рухи опонента, і ти вже знаєш як відповісти. (Тягнеш з кололди опонента 2 карти, а не одну, і обираєш яка спрацює. Так, це імбово, чумба!).
      </Tile>
    </div>
  );
};
