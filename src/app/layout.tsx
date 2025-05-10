export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from "next";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import AppProvider from "~/widgets/AppProvider/AppProvider";

import "~/ui/global.css";
import AppHeader from "~/widgets/AppHeader/AppHeader";

export const metadata: Metadata = {
  title: "Neon Assembly",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="bg-[#f8ef02]">
        <AppProvider>
          <AppHeader />
          {props.children}

          <ReactQueryDevtools initialIsOpen={false} />
        </AppProvider>
      </body>
    </html>
  );
}
