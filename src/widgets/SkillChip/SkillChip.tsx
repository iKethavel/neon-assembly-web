'use client'
import { Button } from '@cybercore/ui/Button';
import { CodeBlock } from '@cybercore/ui/CodeBlock';
import { Tile } from '@cybercore/ui/Tile';
import React from 'react';
import type { SkillChipProps } from './types';
import { useSkillChip } from './useSkillChip';
import { QRCode } from '~/widgets/QRCode';


const SkillChip: React.FC<SkillChipProps> = ({ characterId, skillChipUid }: SkillChipProps) => {
  const { chipData, characterData, isOwnerViewing, injectSkillChip, canInject } = useSkillChip({ characterId, skillChipUid });

  return (
    <div className='flex flex-col gap-2 p-2'>
      <Tile label={`${chipData.name}${chipData.character ? ` [Belongs to: ${chipData.character.name}]` : ''}`}>
        <p className='px-2'>
          {chipData.advantage}
        </p>
      </Tile>

      {characterData.role === 'techie' &&
        <div>
          <CodeBlock title='Disadvantage' code={chipData.disadvantage} />
        </div>
      }

      {(!isOwnerViewing || !chipData.character) && <Button text="Inject" loading={canInject} onClick={injectSkillChip} />}
      {isOwnerViewing && <QRCode data={`${window.origin}/skill-chips/${skillChipUid}`} />}
    </div>
  );
};

export default SkillChip;