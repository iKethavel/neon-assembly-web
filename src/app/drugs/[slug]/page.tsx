import LinkButton from "~/widgets/LinkButton/LinkButton";
import { Drug } from "~/widgets/Drug/Drug";
import { ToggleQR } from "~/widgets/ToggleQR";

interface DrugsPageProps {
  params: Promise<{
    slug: string;
  }>
}

export default async function Page({ params }: DrugsPageProps) {
  const { slug } = await params

  return <div>
    <div className="flex justify-between mb-4">
      <LinkButton text="Back" href={`/characters`} />
      <ToggleQR />
    </div>

    <Drug slug={slug} />
  </div>
}