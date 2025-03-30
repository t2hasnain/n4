'use client';

import { useEffect } from 'react';

// This component handles client-side-only functionality
export default function ClientLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 