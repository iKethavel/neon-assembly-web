import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export const useContactList = (characterId: string) => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { mutateAsync } = useMutation(trpc.characters.addContactBySSN.mutationOptions({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: trpc.characters.getById.pathKey(),
      });
    },
  }))


  const addContactBySSN = async () => {
    try {
      const ssn = prompt("Enter the SSN of the contact you want to add:");
      if (!ssn) {
        alert("SSN is required to add a contact.");
        return;
      }

      const data = await mutateAsync({
        ssn,
        characterId
      })

      if (data === 'not_found') {
        alert("Contact not found.");
        return;
      }
      if (data === 'already_added') {
        alert("Contact already added.");
        return;
      }
      alert("Contact added successfully!");

    } catch (error) {
      console.error("Error adding contact by SSN:", error);
      throw error;
    }

  }

  return {
    addContactBySSN
  }
}