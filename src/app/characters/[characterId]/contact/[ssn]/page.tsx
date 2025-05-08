import { prefetch, trpc } from "~/trpc/server";
import LinkButton from "~/widgets/LinkButton/LinkButton";
import { ContactWidget } from "./_lib/widgets/ContactWidget/ContactWidget";

interface ContactSSNPageProps {
  params: Promise<{
    characterId: string;
    ssn: string;
  }>
}

export default async function ContactSSNPage({ params }: ContactSSNPageProps) {
  const { characterId, ssn } = await params;
  prefetch(trpc.characters.getContact.queryOptions({ ssn, characterId }));

  return (
    <div>
      <div className="mb-4">
        <LinkButton text="Back" href={`/characters/${characterId}`} />
      </div>

      <ContactWidget characterId={characterId} ssn={ssn} />
    </div>
  );
};
