'use client';

import { useEffect } from 'react';
import { trackProductView } from '../../account/recently-viewed/actions';

export function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackProductView(productId);
  }, [productId]);

  return null; // Invisible component
}
