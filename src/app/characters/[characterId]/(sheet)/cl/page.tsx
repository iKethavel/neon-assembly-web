import { ContactList } from "./_lib/components/ContactList";

interface CharacterNLPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function CharacterNLPage({ params }: CharacterNLPageProps) {
  const { characterId } = await params;

  return (
    <div>
      <ContactList characterId={characterId} />
    </div>
  );
};
