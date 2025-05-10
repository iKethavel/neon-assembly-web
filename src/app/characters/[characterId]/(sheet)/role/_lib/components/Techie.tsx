'use client';

import { Tile } from '@cybercore/ui/Tile';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { useTRPC } from '~/trpc/client';
import { SelectInput } from '@cybercore/ui/Input';
import { Button } from '@cybercore/ui/Button';
import { CodeBlock } from '@cybercore/ui/CodeBlock';
import { Heading } from '@cybercore/ui/Heading';
import { CountdownButton } from '~/widgets/CountdownButton/CountdownButton';
import Image from 'next/image';

interface TechieProps {
  characterId: string;
}

export const Techie: React.FC<TechieProps> = ({ characterId }: TechieProps) => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));
  const contactListOptions = data.contactList.map((contact) => ({
    label: contact.character.name,
    value: contact.character.documentId,
  }));

  const [patientOption, setOption] = useState<string>(contactListOptions.at(0)?.value || '');
  const { data: patientData } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: patientOption }, { enabled: !!patientOption }));
  const { mutateAsync: fixChip, isPending } = useMutation(trpc.characters.fixChip.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });
    },
  }))

  const [showList, setShowList] = useState(false);
  const handleOperation = useCallback(() => {
    if (!patientOption) return alert('Пацієнт не обраний!');

    const hasConfirmed = confirm('Ви впевнені, що хочете провести операцію? Цю дію можна здійснити за згоди гравця!');
    setShowList(hasConfirmed)
  }, [patientOption]);


  const handleFixChip = useCallback(async (disadvantageId: number) => {
    if (!patientOption) return alert('Пацієнт не обраний!');

    const hasConfirmed = confirm('Ви впевнені, що хочете провести операцію і вилучити цей недолік?');
    if (!hasConfirmed) throw new Error('Операцію скасовано!')

    return await fixChip({ characterId: patientOption, disadvantageId });
  }, [patientOption, fixChip]);


  return (
    <div className="grid gap-1">
      <Tile
        imageNode={<Image src="/role/techie-ability1.png" alt="Solo Ability 1" width={100} height={100} />}
      >
        <p>
          Ти знаєш імпланти і техніку як свої 5 пальців, коли вони у тебе ще були органічні. (Можеш дізнатися негативний ефекти скілчіпа оглянувши його) І навіть можеш налаштувати його так, що чумба не буде страждати від негативних ефектів. (Можеш відключити прояв негативного ефекту у гравця який його собі вставив, не повністю “полікувати” чіп.)
        </p>
        <div className="width-full flex flex-col gap-4">
          <SelectInput
            size='long'
            options={contactListOptions}
            onChange={(e) => setOption(e.target.value)}
          />
          <Button text="ОПЕРУВАТИ" onClick={handleOperation} />


          {showList && patientData && (
            <div>
              <Heading level={4} className="text-center">Знайдені проблеми:</Heading>
              <div className="flex flex-col gap-2">
                {patientData.disadvantages.map((disadvantage) => (
                  <div key={disadvantage.id} className="grid grid-cols-[2fr_1fr] gap-2">
                    <CodeBlock
                      title={disadvantage.sensor || 'undefined;'}
                      code={disadvantage.message}
                    />
                    <CountdownButton action='fixingChip' text="FIX" loading={isPending} onClick={() => handleFixChip(disadvantage.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Tile>
    </div>
  );
};
