import { NeuroLink } from "./_lib/components/NeuroLink";

interface CharacterNLPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterNLPage({ params }: CharacterNLPageProps) {
  const { characterId } = await params;

  return (
    <div>
      <NeuroLink characterId={characterId} />
    </div>
  );
};
