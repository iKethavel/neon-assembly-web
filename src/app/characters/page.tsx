import React from 'react';
import { prefetch, trpc } from '~/trpc/server';
import { CharactersData } from './_lib/components/CharactersData';

export default function CharactersPage() {
  prefetch(trpc.characters.getAllForUser.queryOptions());

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>Available characters:</h1>

      <CharactersData />
    </div>
  );
};


