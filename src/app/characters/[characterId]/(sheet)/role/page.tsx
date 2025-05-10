import type { FC } from "react";
import { createCaller, createTRPCContext } from "@cybercore/api";
import { Netrunner } from "./_lib/components/Netrunner";
import { Medtech } from "./_lib/components/Medtech";
import { Media } from "./_lib/components/Media";
import { Fixer } from "./_lib/components/Fixer";
import { Solo } from "./_lib/components/Solo";
import { Techie } from "./_lib/components/Techie";

interface CharacterNLPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterNLPage({ params }: CharacterNLPageProps) {
  const { characterId } = await params;

  const ctx = await createTRPCContext()
  const trpc = createCaller(ctx)
  const data = await trpc.characters.getById({ id: characterId })

  const Component = roleToComponent[data.role]
  if (!Component) throw new Error(`No component found for role: ${data.role}`)

  return (
    <div>
      <Component characterId={characterId} />
    </div>
  );
};


const roleToComponent: Record<string, FC<{ characterId: string }>> = {
  'netrunner': Netrunner,
  'medtech': Medtech,
  'media': Media,
  'fixer': Fixer,
  'solo': Solo,
  'techie': Techie,
}
