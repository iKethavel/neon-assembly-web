'use client'; // Add this if using App Router

import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AppHeader() {

  return (
    <div className="flex align-middle justify-center bg-[black]">
      <div className="absolute left-4 h-16 flex">

      </div>

      <div className="p-1">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Cyberpunk Logo"
            width={112}
            height={56}
          />
        </Link>
      </div>

      <div className="absolute right-4 h-16 flex">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </div>
  )
}