'use client';

import { useEffect, useRef } from 'react';

/**
 * Embeds a Twitter/X tweet by URL.
 * widgets.js only recognizes twitter.com URLs, so we normalize x.com → twitter.com
 */
export function TweetEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // widgets.js doesn't recognize x.com - must use twitter.com
  const embedUrl = url.replace(/^https:\/\/x\.com\//, 'https://twitter.com/');

  useEffect(() => {
    if (!embedUrl || !containerRef.current) return;

    const loadWidget = () => {
      const twttr = (window as unknown as { twttr?: { widgets: { load: (el?: HTMLElement) => void } } }).twttr;
      if (twttr?.widgets) {
        twttr.widgets.load(containerRef.current ?? undefined);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = loadWidget;
    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existing) existing.remove();
    };
  }, [embedUrl]);

  return (
    <div className="mt-3 pl-16 w-[400px]">
      <div
        ref={containerRef}
        className="[&_.twitter-tweet]:max-w-full"
        style={{ zoom: 0.73 }}
      >
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={embedUrl}>View on X</a>
        </blockquote>
      </div>
    </div>
  );
}
