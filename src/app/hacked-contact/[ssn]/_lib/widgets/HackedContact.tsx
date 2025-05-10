'use client';

import { Heading } from '@cybercore/ui/Heading';
import { Tile } from '@cybercore/ui/Tile';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { useTRPC } from '~/trpc/client';
import Image from 'next/image';
import { Button } from '@cybercore/ui/Button';

interface HackedContactProps {
  ssn: string;
}

export const HackedContact: React.FC<HackedContactProps> = ({ ssn }) => {
  const queryClient = useQueryClient();

  const _characterId = typeof window !== 'undefined' ? localStorage.getItem('characterId') : ''

  const trpc = useTRPC();
  const { data: contactData } = useSuspenseQuery(trpc.characters.getContactBySSN.queryOptions({ ssn }));
  const { data: characterData } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: _characterId ?? '' }, { enabled: !!_characterId }));

  const { mutateAsync, isPending } = useMutation(trpc.characters.addContactBySSN.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.characters.getContactBySSN.pathKey(),
      });
    }
  }))

  const hackContact = useCallback(async () => {
    try {
      if (!_characterId) {
        alert('Вам потрібно вибрати персонажа, щоб зламати контакт. Зайдіть в меню персонажів і виберіть персонажа.');
      }

      const hasConfirmed = confirm(`Ви впевнені, що хочете зламати ${contactData.name}?`);
      if (!hasConfirmed) return;

      await mutateAsync({
        ssn,
        characterId: _characterId ?? ''
      })

      alert(`Контакт [${contactData.name}] зламано і додано в список контактів!`);
    } catch (error) {
      console.error('Error hacking contact:', error);
      alert('Не вдалося зламати контакт. Спробуйте ще раз або зверніться до ГМ.');

      const _error = error as Error;
      if (_error) alert(_error.message)
    }
  }, [_characterId, contactData.name, mutateAsync, ssn])

  const hasContact = characterData.contactList.some((contact) => contact.character.ssn === ssn);

  return (
    <div className="grid gap-1">
      <Heading level={4}>Профіль: {contactData.name}</Heading>

      <Tile
        imageNode={<Image src={contactData.avatar || ''} alt="Solo Ability 1" width={100} height={50} />}>
        {hasContact && <Button text="Hack this motherf*cker" onClick={hackContact} loading={isPending} />}
        {!hasContact && <Heading level={5}>Контакт вже зламаний!</Heading>}
      </Tile>
    </div >
  );
};
