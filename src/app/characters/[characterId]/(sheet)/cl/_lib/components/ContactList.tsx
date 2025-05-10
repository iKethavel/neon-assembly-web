'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Tile } from '@cybercore/ui/Tile';
import { TextInput } from '@cybercore/ui/Input';
import { Button } from '@cybercore/ui/Button';
import { useTRPC } from '~/trpc/client';
import { useContactList } from '../hooks/useContactList';
import Link from 'next/link';


interface ContactListProps {
  characterId: string;
}

export const ContactList: React.FC<ContactListProps> = ({ characterId }: ContactListProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  const { addContactBySSN } = useContactList(characterId);

  const [search, setSearch] = useState<string>('')

  const filteredContacts = data.contactList.filter((contact) => {
    const name = contact.character.name.toLowerCase();
    const role = contact.character.role.toLowerCase();
    const searchTerm = search.toLowerCase();

    return name.includes(searchTerm) || role.includes(searchTerm);
  });

  return (
    <div>
      <div className="grid gap-1 my-4 px-2">
        <div className="my-2 grid w-full">
          <Button text='+ by ssn' onClick={addContactBySSN} />
        </div>
        <TextInput size='long' variant='black' placeholder="Search by name or role" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-1 p-1">
        {filteredContacts.map((contact, idx) => (
          <Link key={idx} href={`/characters/${characterId}/contact/${contact.character.ssn}`} className="w-full">
            <Tile
              imageSrc={contact.character.avatar ?? 'https://png.pngtree.com/png-vector/20250220/ourmid/pngtree-anonymous-user-avatar-with-glitch-effect-vector-png-image_15542337.png'}
              imageClassname='!h-[10rem] object-cover '
              variant='black'
            >
              <p className="text-center">[{contact.breach}] {contact.character.name}</p>
            </Tile>
          </Link>
        ))}
      </div>

      {search && filteredContacts.length === 0 && (
        <div className="text-center">
          <p className="text-gray-500">No contacts found for {search}</p>
        </div>
      )}
    </div>
  );
};
