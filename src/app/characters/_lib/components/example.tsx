"use client";

import {
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "~/trpc/client";

export function ExampleData() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.example.getData.queryOptions({ text: 'demo' }));

  return (
    <div className="flex w-full flex-col gap-4">
      {data}
    </div>
  );
}
