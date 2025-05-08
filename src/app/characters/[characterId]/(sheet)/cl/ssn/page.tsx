interface ContactSSNPageProps {
  params: Promise<{
    characterId: string;
  }>
}

export default async function ContactSSNPage({ params }: ContactSSNPageProps) {
  const { characterId } = await params;

  return (
    <div>
      {characterId}
    </div>
  );
};
