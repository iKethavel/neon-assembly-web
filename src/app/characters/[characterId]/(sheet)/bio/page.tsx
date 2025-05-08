import { Biography } from "./_lib/components/Biography";

interface CharacterBioPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterBioPage({ params }: CharacterBioPageProps) {
  const { characterId } = await params;

  return (
    <div>
      <Biography characterId={characterId} />
    </div>
  );
};
