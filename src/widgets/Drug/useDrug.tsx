'use client'

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';
import type { DrugProps } from './types';
import { useState } from 'react';

export const useDrug = ({ characterId, slug }: DrugProps) => {
  const _characterId = characterId ?? localStorage.getItem('characterId') ?? ''

  const trpc = useTRPC()

  const { data: drugData, error: drugError } = useSuspenseQuery(trpc.shop.getDrug.queryOptions({ slug }));
  const { data: characterData } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: _characterId }, { enabled: !!_characterId }));

  const [open, setOpen] = useState(false)
  const handleVerify = async () => {
    setOpen(true)
  }

  const canView = characterData.role === 'medtech'

  return {
    drugData,
    drugError,
    characterData,
    canView,
    open,
    handleVerify
  }
}