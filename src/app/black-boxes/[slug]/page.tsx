import LinkButton from "~/widgets/LinkButton/LinkButton";
import { BlackBox } from "~/widgets/BlackBox/BlackBox";
import { ToggleQR } from "~/widgets/ToggleQR";

interface BlackBoxPageProps {
  params: Promise<{
    slug: string;
  }>
}

export default async function Page({ params }: BlackBoxPageProps) {
  const { slug } = await params

  return <div>
    <div className="flex justify-between mb-4">
      <LinkButton text="Back" href={`/characters`} />
      <ToggleQR />
    </div>

    <BlackBox blackBoxSlug={slug} />
  </div>
}