'use client';

import { Tile } from '@cybercore/ui/Tile';
import React from 'react';
import Image from 'next/image';

interface FixerProps {
  characterId: string;
}

export const Fixer: React.FC<FixerProps> = () => {
  return (
    <div className="grid gap-1">
      <Tile
        imageNode={<Image src="/role/fixer-ability1.png" alt="Solo Ability 1" width={100} height={100} />}
      >
        Вони навіть не уявляють скільки ти можеш. Скільки компромату маєш, скільки секретів знаєш, скільки послуг тобі винні. І коли треба, ти не соромишся використовувати інших заради своїх цілей. (Можеш змусити іншого персонажа виконати якусь дію, яку той фізично здатен виконати протягом наступних 10 хвилин. Послуга НЕ має стосуватися телефона і CyberAct). Даєш йому свою візитівку, і він знатиме про що йде мова, залишилося тільки віддати йому вказівку.      </Tile>
    </div>
  );
};
