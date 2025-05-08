'use client';

import React from 'react';
import { CodeBlock } from '@cybercore/ui/CodeBlock';

import { Button } from "@cybercore/ui/Button";
import { useContactWidget } from './useContactWidget';
import { SpaceDefender } from '~/widgets/Haking/SpaceDefender/SpaceDefender';
import { CountdownButton } from '~/widgets/CountdownButton/CountdownButton';
import { Heading } from '@cybercore/ui/Heading';


interface ContactWidgetProps {
  characterId: string;
  ssn: string;
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({ characterId, ssn }: ContactWidgetProps) => {
  const {
    contact,
    breach,
    handleMoneyTransfer,
    canTransfer,
    isHacking,
    handleHackingStart,
    handleHackingResult,
  } = useContactWidget(characterId, ssn);

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr] gap-1">
        <Button text="Transfer €$" onClick={handleMoneyTransfer} loading={!canTransfer} />
        <CountdownButton action="hacking" text="HACK" onClick={handleHackingStart} />
      </div>

      {isHacking && <SpaceDefender onGameOver={handleHackingResult} />}

      <div className='grid gap-1 p-1'>
        <Heading level={3} className="text-center">Current breach level: {breach} / 3</Heading>
        <CodeBlock
          title={`Breach: Level 1`}
          code={
            breach >= 1 ? (
              <div>
                <p>
                  Money: {contact.eurodollars} €$
                </p>
              </div>
            ) : <p>No info;</p>
          }
        />

        <CodeBlock
          title={`Breach: Level 2`}
          code={
            breach >= 2 ? (
              <div className='flex flex-col gap-2'>
                <Heading level={6} className="text-center">Disadvantages:</Heading>
                <ul>
                  {contact.disadvantages.map((disadvantage, index) => (
                    <li key={index}>[{disadvantage.sensor}] {disadvantage.message}</li>
                  ))}
                </ul>

                <Heading level={6} className="text-center">Cyberpsychosis:</Heading>
                <ul>
                  {contact.cyber_psychoses.map((cpsy, index) => (
                    <li key={index}>{cpsy.title}</li>
                  ))}
                </ul>


                <Heading level={6} className="text-center">Contact List:</Heading>
                <ul>
                  {contact.contactList.map((cp, index) => (
                    <li key={index}>{cp.name} [{cp.ssn}]</li>
                  ))}
                </ul>
              </div>
            ) : <p>No info;</p>
          }
        />

        <CodeBlock
          title={`Breach: Level 3`}
          code={
            breach >= 3 ? (
              <div className='flex flex-col gap-2'>
                <Heading level={6} className="text-center">Secrets:</Heading>
                <ul>
                  {contact.secrets.map((sec, index) => (
                    <li key={index}>{sec.description}</li>
                  ))}
                </ul>
              </div>
            ) : <p>No info;</p>
          }
        />
      </div>
    </>
  );
};



