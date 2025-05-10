import { HackedContact } from "./_lib/widgets/HackedContact";

interface HackedContactPageProps {
  params: Promise<{
    ssn: string;
  }>
}

export default async function Page({ params }: HackedContactPageProps) {
  const { ssn } = await params

  return <div>
    <HackedContact ssn={ssn} />
  </div>
}