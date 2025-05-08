'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { useTRPC } from '~/trpc/client';
import { CodeBlock } from '@cybercore/ui/CodeBlock'

export const NewsLog: React.FC = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.events.getNews.queryOptions());

  return (
    <div className="grid gap-1">
      {data.map((nl) => (
        <CodeBlock
          key={nl.id}
          className='!text-wrap'
          title={nl.sender}
          code={nl.message}
        />
      ))}
    </div>
  );
};
