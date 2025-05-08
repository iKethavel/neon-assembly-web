import { redirect } from 'next/navigation'


interface CharacterPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterNLPage({ params }: CharacterPageProps) {
  const { characterId } = await params;
  redirect(`/characters/${characterId}/bio`)
};
