
// import { HydrateClient, prefetch, trpc } from "~/trpc/server";
// import { ExampleData } from "./_lib/components/example";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@cybercore/ui/Button";
import LinkButton from "~/widgets/LinkButton/LinkButton";

export default function HomePage() {
  // prefetch(trpc.example.getData.queryOptions({ text: 'demo' }));


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 mb-40 mt-20">
        <SignedOut>
          <SignInButton>
            <Button text="Login" glitchText="throw err;" variant="red" />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <LinkButton text="Characters" glitchText="throw err;" variant="purple" href="/characters" />
          <LinkButton text="Drugs" glitchText="throw err;" variant="red" href="/drugs" />
        </SignedIn>
      </div>

      <div className="mt-auto">
        <Button text="Instagram" glitchText="throw err;" variant="dark" />
      </div>

    </div>
  )
}
