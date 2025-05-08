'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { useTRPC } from '~/trpc/client';
import { CodeBlock } from '@cybercore/ui/CodeBlock'

interface BiographyProps {
  characterId: string;
}

export const Biography: React.FC<BiographyProps> = ({ characterId }: BiographyProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  return (
    <div className="grid gap-1">
      <CodeBlock className='!text-wrap' title='BIO: ' code={data.description} />
    </div>
  )
}
