'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTRPC } from '~/trpc/client';
import { CodeBlock } from '@cybercore/ui/CodeBlock'
import { Button } from '@cybercore/ui/Button';
import { QRCode } from '~/widgets/QRCode';
import { useOneSignal } from '~/widgets/Notification/useOneSignal';


interface CharacterCommonProps {
  characterId: string;
}

export const CharacterCommon: React.FC<CharacterCommonProps> = ({ characterId }: CharacterCommonProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  const [showQR, setShowQR] = useState(false)
  const [qr] = useState<string | null>(`http://192.168.0.100:3000/characters/${characterId}/nl`)

  useOneSignal();

  useEffect(() => {
    localStorage.setItem('characterId', characterId)
  }, [characterId])

  return (
    <>

      <div className="grid grid-cols-[2fr_1fr_1fr] gap-1">
        <CodeBlock title='NAME: ' code={data.name} tick />
        <CodeBlock title='€$: ' code={data.eurodollars.toFixed(0)} />
        <Button text="QR" onClick={() => {
          setShowQR(true)
        }} />
      </div>

      {
        showQR && <div className="fixed inset-0 z-50 bg-black grid grid-rows-[4rem_auto]">
          <Button
            text='X'
            // className="absolute top-2 left-2 text-yellow-500"
            onClick={() => setShowQR(false)}
          />

          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            {qr && <QRCode data={qr} />}
          </div>
        </div>
      }
    </>
  );
};
