'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { useTRPC } from '~/trpc/client';
import { CodeBlock } from '@cybercore/ui/CodeBlock'
import { Heading } from '@cybercore/ui/Heading';


interface NeuroLinkProps {
  characterId: string;
}

export const NeuroLink: React.FC<NeuroLinkProps> = ({ characterId }: NeuroLinkProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  return (
    <div>
      <div>
        <Heading className='text-center'>Skill chips bugs:</Heading>
        <div>
          {
            data.disadvantages.map((dis) => (
              <CodeBlock
                key={dis.id}
                title={dis.sensor ?? 'undefined'}
                code={dis.message}
              />
            ))
          }
        </div>
      </div>

      <div className="grid gap-1">
        <Heading className='text-center'>Neuro system warnings:</Heading>

        <div className="grid gap-1">
          {data.nervous_system.map((nervousSystem) => (
            <CodeBlock
              key={nervousSystem.id}
              className='!text-wrap'
              title={`SENSOR: ${nervousSystem.sensor ?? 'undefined;'}`}
              code={nervousSystem.message}
            />
          ))}
        </div>
      </div>
    </div>
  )
};
