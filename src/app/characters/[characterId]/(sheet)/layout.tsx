import React from 'react';
import { Tabs } from '../_lib/components/Tabs/Tabs';
import { prefetch, trpc } from '~/trpc/server';
import { CharacterCommon } from '../_lib/components/CharacterCommon';

interface CharacterLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterLayout({ children, params }: CharacterLayoutProps) {
  const { characterId } = await params;

  prefetch(trpc.characters.getById.queryOptions({ id: characterId }));

  return (
    <div>
      <CharacterCommon characterId={characterId} />
      <Tabs
        tabs={[
          { id: 'bio', label: 'B', href: `bio` },
          { id: 'nl', label: 'NL', href: `nl` },
          { id: 'sc', label: 'SC', href: `sc` },
          { id: 'role', label: 'R', href: `role` },
          { id: 'cl', label: 'CL', href: `cl` },
          { id: 'news', label: 'NS', href: `news` },
        ]}
        variant="green"
      />
      <main>{children}</main>
    </div>
  );
};

