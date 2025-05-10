'use client';

import { Heading } from '@cybercore/ui/Heading';
import { Tile } from '@cybercore/ui/Tile';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { useTRPC } from '~/trpc/client';
import Image from 'next/image';
import { Button } from '@cybercore/ui/Button';

interface HackedContactProps {
  ssn: string;
}

export const HackedContact: React.FC<HackedContactProps> = ({ ssn }) => {
  const _characterId = typeof window !== 'undefined' ? localStorage.getItem('characterId') : ''

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getContactBySSN.queryOptions({ ssn }));
  const { mutateAsync, isPending } = useMutation(trpc.characters.addContactBySSN.mutationOptions())

  const hackContact = useCallback(async () => {
    try {
      const hasConfirmed = confirm(`Ви впевнені, що хочете зламати ${data.name}?`);
      if (!hasConfirmed) return;

      await mutateAsync({
        ssn,
        characterId: _characterId ?? ''
      })
    } catch (error) {
      console.error('Error hacking contact:', error);
      alert('Не вдалося зламати контакт. Спробуйте ще раз або зверніться до ГМ.');
    }
  }, [_characterId, data.name, mutateAsync, ssn])

  return (
    <div className="grid gap-1">
      <Heading level={4}>Профіль: {data.name}</Heading>

      <Tile
        imageNode={<Image src={data.avatar || ''} alt="Solo Ability 1" width={100} height={50} />}>
        <Button text="Hack this motherf*cker" onClick={hackContact} loading={isPending} />
      </Tile>
    </div >
  );
};
