import React from 'react';
import { currentUser } from '@clerk/nextjs/server'
import { createCaller, createTRPCContext } from '@cybercore/api';
import { redirect } from 'next/navigation';

interface CharacterPageProps {
  children: React.ReactNode;
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterLayout({
  children,
  params
}: CharacterPageProps) {
  const { characterId } = await params;

  const user = await currentUser()
  const ctx = await createTRPCContext()
  const trpc = createCaller(ctx)
  const data = await trpc.characters.getById({ id: characterId })

  const test = !user || !data || data?.player?.username !== user.emailAddresses.at(0)?.emailAddress
  if (test) return redirect('/')

  return children
}