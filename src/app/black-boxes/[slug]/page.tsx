import LinkButton from "~/widgets/LinkButton/LinkButton";
import { BlackBox } from "~/widgets/BlackBox/BlackBox";
import Toggle from "./_lib/widgets/Toggle";
import { QRCode } from "~/widgets/QRCode";

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
      <Toggle
        onTrue={<QRCode data={`https://www.inkripple.com/black-boxes/${slug}`} />}
      />
    </div>

    <BlackBox blackBoxSlug={slug} />
  </div>
}