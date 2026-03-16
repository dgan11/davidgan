'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type LazyRenderOnVisibleProps = {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
};

export function LazyRenderOnVisible({
  children,
  fallback = null,
  rootMargin = '300px 0px',
}: LazyRenderOnVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || hasBeenVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasBeenVisible(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [hasBeenVisible, rootMargin]);

  return <div ref={containerRef}>{hasBeenVisible ? children : fallback}</div>;
}
