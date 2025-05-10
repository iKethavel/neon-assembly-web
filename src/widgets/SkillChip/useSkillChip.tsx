'use client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';
import type { SkillChipProps } from './types';
import { useCallback } from 'react';

export const useSkillChip = ({ characterId, skillChipUid }: SkillChipProps) => {
  const _characterId = characterId ?? localStorage.getItem('characterId') ?? ''

  const queryClient = useQueryClient();
  const trpc = useTRPC()

  const { data: chipData } = useSuspenseQuery(trpc.shop.getSkillChip.queryOptions({ uid: skillChipUid }));
  const { data: characterData } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: _characterId }, { enabled: !!_characterId }));

  const { mutateAsync, isPending } = useMutation(trpc.characters.injectChip.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.shop.getSkillChip.pathKey(),
      });
    },
  }))


  const isOwnerViewing = chipData.character?.documentId === _characterId || !chipData.character

  const injectSkillChip = useCallback(async () => {
    if (!_characterId) return

    const proceed = confirm('You can inject it only with owner\'s permission. Proceed?')
    if (!proceed) return

    await mutateAsync({
      characterId: _characterId,
      skillChipUid
    })

  }, [_characterId, mutateAsync, skillChipUid])

  const canInject = isPending

  return {
    chipData,
    characterData,
    isOwnerViewing,
    injectSkillChip,
    canInject
  }
}