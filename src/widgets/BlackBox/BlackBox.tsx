'use client';

import { useState } from "react";
import { CodeBlock } from "@cybercore/ui/CodeBlock";
import type { BlackBoxProps } from "./types";
import { useBlackBox } from "./useBlackBox";
import { Heading } from "@cybercore/ui/Heading";
import { TextInput } from "@cybercore/ui/Input";
import { Button } from "@cybercore/ui/Button";

export const BlackBox: React.FC<BlackBoxProps> = (props) => {
  const { characterData, blackBoxData, canOpen, joinBox, openBox } = useBlackBox(props);

  const [password, setPassword] = useState<string>('');

  return (
    <div className="grid gap-4 p-2">
      {blackBoxData.isOpened && <CodeBlock code={blackBoxData.content} />}

      {
        !blackBoxData.isOpened &&
        <div className="flex flex-col gap-4">
          <Heading level={3} className="text-center">{blackBoxData.name}</Heading>

          {blackBoxData.password && <TextInput placeholder="Password" onChange={e => setPassword(e.target.value)} />}

          <div className="flex flex-col gap-2">
            {blackBoxData.helpers.map(helper => (
              <CodeBlock
                key={helper.id}
                title={helper.role}
                code={<div className="flex flex-col gap-2">
                  {helper.character && <Heading level={4} className="text-center mb-2">{helper.character.name}</Heading>}
                  {!helper.character && characterData?.role === helper.role && !blackBoxData.helpers.some(h => h.character?.documentId === characterData.documentId) && <Button variant="purple" text="Join" size="small" onClick={() => joinBox(helper.id)} />}
                </div>
                }
              />
            ))}
          </div>


          <div className="w-full flex justify-center">
            <Button className="w-full" text="OPEN" size="big" disabled={!canOpen} onClick={() => openBox(password)} />
          </div>
        </div>
      }

    </div>
  );
}