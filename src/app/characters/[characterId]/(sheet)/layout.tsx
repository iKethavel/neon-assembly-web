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
          { id: 'bio', label: 'B', href: `bio`, icon: '/tabs/bio.png' },
          { id: 'nl', label: 'NL', href: `nl`, icon: '/tabs/nl.png' },
          { id: 'sc', label: 'SC', href: `sc`, icon: '/tabs/sc.png' },
          { id: 'role', label: 'R', href: `role`, icon: '/tabs/role.png' },
          { id: 'cl', label: 'CL', href: `cl`, icon: '/tabs/cl.png' },
          { id: 'news', label: 'NS', href: `news`, icon: '/tabs/ns.png' },
        ]}
        variant="purple"
      />
      <main>{children}</main>
    </div>
  );
};

