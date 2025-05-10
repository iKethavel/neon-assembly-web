'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTRPC } from '~/trpc/client';
import { CodeBlock } from '@cybercore/ui/CodeBlock'
import { ToggleQR } from '~/widgets/ToggleQR';
import { Bar } from '@cybercore/ui/Bar';

interface CharacterCommonProps {
  characterId: string;
}

export const CharacterCommon: React.FC<CharacterCommonProps> = ({ characterId }: CharacterCommonProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  const { data: gameSettingsData } = useSuspenseQuery(trpc.gameSettings.getData.queryOptions());


  const [qr] = useState<string>(() => {
    const base = typeof window !== "undefined" ? window.origin : ''
    return `${base}/hacked-contact/${data.ssn}`
  })

  useEffect(() => {
    localStorage.setItem('characterId', characterId)
  }, [characterId])

  const virusLevel = data.virus > gameSettingsData.virusDead
    ? 'DEADLY 💀'
    : data.virus > gameSettingsData.virusWarning
      ? 'HIGH'
      : 'LOW'

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-1">
        <CodeBlock title='NAME: ' code={data.name} tick />
        <CodeBlock title='€$: ' code={data.eurodollars.toFixed(0)} />
        <ToggleQR link={qr} />
      </div>

      {gameSettingsData.showVirusBar && <div className='my-1'>
        <Bar content={`УВАГА! ТВІЙ РІВЕНЬ ВІРУСУ: ${virusLevel}`} glitch={data.virus > gameSettingsData.virusWarning} />
      </div>
      }
    </>
  );
};
