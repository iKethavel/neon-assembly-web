import React from 'react';
import { TRPCReactProvider } from "~/trpc/client";
import { ClerkProvider } from '@clerk/nextjs';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      <ClerkProvider>
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
      </ClerkProvider>
    </>
  );
};

export default AppProvider;