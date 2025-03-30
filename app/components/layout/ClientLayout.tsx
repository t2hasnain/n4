'use client';

import dynamic from 'next/dynamic';

// Lazy load the CustomCursor component (only needed on client-side)
const CustomCursor = dynamic(() => import('../ui/CustomCursor'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
} 