import LinkButton from "~/widgets/LinkButton/LinkButton";
import SkillChip from "~/widgets/SkillChip/SkillChip";
import { ToggleQR } from "~/widgets/ToggleQR";

interface SkillChipPageProps {
  params: Promise<{
    uid: string;
  }>
}

export default async function Page({ params }: SkillChipPageProps) {
  const { uid } = await params

  return <div>
    <div className="flex justify-between mb-4">
      <LinkButton text="Back" href={`/characters`} />
      <ToggleQR />
    </div>

    <SkillChip skillChipUid={uid} />
  </div>
}