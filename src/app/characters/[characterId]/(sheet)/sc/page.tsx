import { SkillChips } from "./_lib/widgets/SkillChips/SkillChips";

interface CharacterNLPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterNLPage({ params }: CharacterNLPageProps) {
  const { characterId } = await params;

  return (
    <div>
      <SkillChips characterId={characterId} />
    </div>
  );
};
