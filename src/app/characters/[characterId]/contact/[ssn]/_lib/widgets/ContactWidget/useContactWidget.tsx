import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTRPC } from '~/trpc/client';

export const useContactWidget = (characterId: string, ssn: string) => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { data: contactData } = useSuspenseQuery(trpc.characters.getContact.queryOptions({ characterId, ssn }));
  const { data: characterData } = useSuspenseQuery(trpc.characters.getById.queryOptions({ id: characterId }));

  const { mutateAsync: transfer, isPending: isPendingTransfer } = useMutation(trpc.banking.transfer.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.characters.getContact.pathKey(),
      });
    },
  }))

  const { mutateAsync: hackContactPerson, isPending: isPendingHacking } = useMutation(trpc.characters.hackContactPerson.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });

      await queryClient.refetchQueries({
        queryKey: trpc.characters.getContact.pathKey(),
      });
    },
  }))

  const handleMoneyTransfer = useCallback(async () => {
    try {
      const intentionResult = prompt(`Your capital is: ${characterData.eurodollars} €$. How much do you want to transfer to ${contactData.character.name} ? `);
      const data = parseInt(intentionResult ?? '');
      if (isNaN(data)) return
      if (data > characterData.eurodollars) return alert('You don\'t have enough money to transfer');

      await transfer({ initiatorId: characterId, receiverId: contactData.character.documentId, amount: data });
      alert(`You have successfully transferred ${data} €$ to ${contactData.character.name}`);

    } catch (error) {
      console.error('Error while transferring money', error);
      alert('Something went wrong. Contact your GM');
    }
  }, [characterData.eurodollars, contactData.character.name, contactData.character.documentId, transfer, characterId]);

  const [isHacking, setIsHacking] = useState(false)
  const handleHackingStart = useCallback(() => {
    setIsHacking(true);
  }, []);

  const handleHackingResult = useCallback(async (score: number) => {
    try {
      const totalScore = characterData.role === 'netrunner' ? score + 500 : score;

      const breachLevel = clamp(Math.round(totalScore / 1000), 0, 3)
      alert(`Your hacking total score is: ${totalScore}. This is a ${breachLevel} breach level.`);
      setIsHacking(false)

      await hackContactPerson({ characterId, ssn, breachLevel });
    } catch (error) {
      console.error('Error while hacking', error);
      alert('Something went wrong. Contact your GM');
    } finally {
      setIsHacking(false)
    }
  }, [characterData.role, characterId, hackContactPerson, ssn]);

  return {
    contact: contactData.character,
    breach: contactData.breach,
    handleMoneyTransfer,
    canTransfer: !isPendingTransfer,
    handleHackingStart,
    isHacking,
    handleHackingResult,
    isPendingHacking
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}