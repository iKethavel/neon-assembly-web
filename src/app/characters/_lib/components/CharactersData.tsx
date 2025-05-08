"use client";

import {
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "~/trpc/client";
import LinkButton from "~/widgets/LinkButton/LinkButton";

export function CharactersData() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getAllForUser.queryOptions());

  return (
    <div className="flex w-full flex-col gap-4 justify-center items-center">
      {data.map((character) => {
        return (
          <LinkButton
            key={character.documentId}
            href={`/characters/${character.documentId}`}
            text={character.name}
            glitchText="throw err;"
          />
        );
      })}
    </div>
  );
}
