'use client';

import { useEffect, useRef } from 'react';

type TwitterWidgets = {
  load: (element?: HTMLElement) => void;
};

declare global {
  interface Window {
    twttr?: {
      widgets?: TwitterWidgets;
    };
    __twitterWidgetsPromise?: Promise<TwitterWidgets>;
  }
}

function loadTwitterWidgets() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Twitter widgets can only load in the browser.'));
  }

  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr.widgets);
  }

  if (window.__twitterWidgetsPromise) {
    return window.__twitterWidgetsPromise;
  }

  window.__twitterWidgetsPromise = new Promise<TwitterWidgets>((resolve, reject) => {
    const handleResolve = () => {
      if (window.twttr?.widgets) {
        resolve(window.twttr.widgets);
        return;
      }

      reject(new Error('Twitter widgets did not initialize.'));
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', handleResolve, { once: true });

      if (window.twttr?.widgets) {
        handleResolve();
      }

      return;
    }

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = handleResolve;
    script.onerror = () => reject(new Error('Failed to load Twitter widgets.'));
    document.body.appendChild(script);
  });

  return window.__twitterWidgetsPromise;
}

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

    loadTwitterWidgets()
      .then((widgets) => {
        widgets.load(containerRef.current ?? undefined);
      })
      .catch(() => {});
  }, [embedUrl]);

  return (
    <div className="mt-3 w-full max-w-[400px] pl-16">
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
