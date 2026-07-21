'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP ERROR BOUNDARY CAUGHT ERROR:", error);
  }, [error]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>App Error Boundary!</h2>
      <p style={{ color: 'red' }}>{error.message || String(error)}</p>
      <p>{error.stack}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
