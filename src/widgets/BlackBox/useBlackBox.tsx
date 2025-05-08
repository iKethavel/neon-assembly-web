'use client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';
import type { BlackBoxProps } from './types';
import { useCallback } from 'react';

export const useBlackBox = ({ characterId, blackBoxSlug }: BlackBoxProps) => {
  const _characterId = characterId ?? localStorage.getItem('characterId') ?? ''

  const queryClient = useQueryClient();
  const trpc = useTRPC()

  const { data: blackBoxData } = useSuspenseQuery(trpc.puzzle.getBlackBox.queryOptions({ slug: blackBoxSlug }));
  const { data: characterData, isSuccess } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: _characterId }, { enabled: !!_characterId }));

  const { mutateAsync: joinBoxMutate } = useMutation(trpc.puzzle.joinBlackBox.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.puzzle.getBlackBox.pathKey(),
      });
    },
  }))


  const { mutateAsync: openBoxMutate } = useMutation(trpc.puzzle.openBlackBox.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.puzzle.getBlackBox.pathKey(),
      });
    },
  }))

  const joinBox = useCallback(async (helperId: number) => {
    if (!_characterId) return

    const hasConfirmed = confirm(`Are you sure you want to join this ${blackBoxData.name}?`)
    if (!hasConfirmed) return

    await joinBoxMutate({
      slug: blackBoxSlug,
      characterId: _characterId,
      helperId
    })

  }, [blackBoxData.name, blackBoxSlug, _characterId, joinBoxMutate])


  const openBox = useCallback(async (password: string) => {
    if (!_characterId) return

    const hasConfirmed = confirm(`Are you sure you want to open this ${blackBoxData.name}?`)
    if (!hasConfirmed) return

    await openBoxMutate({
      slug: blackBoxSlug,
      password
    })

  }, [_characterId, blackBoxData.name, openBoxMutate, blackBoxSlug])

  const canOpen = blackBoxData.helpers.every(helper => helper.character)



  return {
    blackBoxData,
    characterData: isSuccess ? characterData : null,
    canOpen,
    joinBox,
    openBox
  }
}