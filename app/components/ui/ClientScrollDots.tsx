'use client';

import dynamic from 'next/dynamic';

// Lazy load the ScrollDots component on the client-side only
const ScrollDots = dynamic(() => import('./ScrollDots'), { ssr: false });

export default function ClientScrollDots({ sections }: { sections: string[] }) {
  return <ScrollDots sections={sections} />;
} 