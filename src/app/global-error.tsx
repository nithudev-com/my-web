'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("GLOBAL ERROR BOUNDARY CAUGHT ERROR:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong!</h2>
          <p style={{ color: 'red' }}>{error.message || String(error)}</p>
          <p>{error.stack}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
