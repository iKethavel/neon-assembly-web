'use client';

import { CodeBlock } from '@cybercore/ui/CodeBlock';
import { TextInput } from '@cybercore/ui/Input';
import { Tile } from '@cybercore/ui/Tile';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTRPC } from '~/trpc/client';
import Image from 'next/image';
import { CountdownButton } from '~/widgets/CountdownButton/CountdownButton';

interface MediaProps {
  characterId: string;
}

export const Media: React.FC<MediaProps> = ({ characterId }: MediaProps) => {
  const trpc = useTRPC();


  const { data: character } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  const { data: eventsFeed } = useSuspenseQuery(trpc.events.getEvents.queryOptions());

  const { mutateAsync } = useMutation(trpc.events.addNews.mutationOptions())
  const [content, setContent] = useState<string>('')

  const handlePost = async () => {
    try {
      await mutateAsync({
        message: content,
        sender: character.name,
      })

      alert("Post made successfully!");

    } catch (error) {
      console.error("Error making a post:", error);
      throw error;
    }
  }

  return (
    <div className="grid gap-4">
      <p>
        Ти голос вулиць! Є люди які тебе слухають і репутація яку треба підтримувати. (Ти можеш публікувати новини в CyberAct. Частота: 1 раз на 15хв). А ще чум, ти маєш контакти в банках, і можеш бачити ВСІ транзакції навколо тебе. (Маєш доступ до списку транзакцій всіх учасників  Neon Assembly).
      </p>
      <Tile
        imageNode={<Image src="/role/media-ability1.png" alt="Solo Ability 1" width={100} height={50} />}
      >
        <div className='grid gap-5'>
          <TextInput
            size='long'
            variant='black'
            placeholder="New post content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <CountdownButton action="posting" text="make a post" onClick={handlePost} />
        </div>
      </Tile>


      <Tile
        imageNode={<Image src="/role/media-ability2.png" alt="Solo Ability 1" width={100} height={50} />}
      >
        <div className='grid gap-1'>
          {eventsFeed.map((event) => (
            <CodeBlock key={event.id} title={event.type}
              code={`Recipient: ${event.receiver}\nSender: ${event.initiator}\nData: ${event.value}`}
            />
          ))}
        </div>
      </Tile>

    </div>
  );
};
