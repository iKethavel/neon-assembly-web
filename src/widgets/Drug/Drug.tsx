'use client'
import { Button } from '@cybercore/ui/Button';
import { CodeBlock } from '@cybercore/ui/CodeBlock';
import React from 'react';
import type { DrugProps } from './types';
import { useDrug } from './useDrug';


export const Drug: React.FC<DrugProps> = ({ characterId, slug }) => {
  const { drugData, drugError, handleVerify, canView, open } = useDrug({ characterId, slug });

  if (drugError) {
    return <div className='text-red-500'>Error: {drugError.message}</div>;
  }

  return (
    <div className='flex flex-col gap-2 p-2'>
      {canView && <Button text="Перевірити" onClick={handleVerify} />}
      <Button text="Вжити" onClick={handleVerify} />

      {!open && <CodeBlock code={drugData.mask} />}
      {open && <CodeBlock title={drugData.name} code={drugData.effect} />}
    </div>
  );
};
