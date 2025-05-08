'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { useTRPC } from '~/trpc/client';

interface FixerProps {
  characterId: string;
}

export const Fixer: React.FC<FixerProps> = ({ characterId }: FixerProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  return (
    <div className="grid gap-1">
      <h1>{data.role}</h1>


    </div>
  );
};
