import LinkButton from "~/widgets/LinkButton/LinkButton";
import SkillChip from "~/widgets/SkillChip/SkillChip";

interface SkillChipPageProps {
  params: Promise<{
    uid: string;
  }>
}

export default async function Page({ params }: SkillChipPageProps) {
  const { uid } = await params

  return <div>
    <div className="mb-4">
      <LinkButton text="Back" href={`/characters`} />
    </div>

    <SkillChip skillChipUid={uid} />
  </div>
}