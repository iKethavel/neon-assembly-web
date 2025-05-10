'use client';

import { CodeBlock } from "@cybercore/ui/CodeBlock";
import { Heading } from "@cybercore/ui/Heading";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "~/trpc/client";

interface SkillChipsProps {
  characterId: string;
}

export const SkillChips = ({ characterId }: SkillChipsProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  return <div>
    {data.skill_chips.length === 0 && <Heading level={2} className="text-center text-2xl" >NO SKILL CHIPS</Heading>}
    <div className="grid grid-cols-2 gap-1 p-1">
      {data.skill_chips.map((skillChip) => (
        <Link key={skillChip.uid} href={`/skill-chips/${skillChip.uid}`} className="w-full">
          <CodeBlock
            title={skillChip.name}
            code={skillChip.advantage}
          />
        </Link>
      ))}
    </div>
  </div>
}