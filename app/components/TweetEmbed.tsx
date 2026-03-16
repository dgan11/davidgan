'use client';

import { Tweet } from 'react-tweet';

function getTweetIdFromUrl(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Embeds a Twitter/X tweet by URL.
 * Uses react-tweet (syndication API) instead of widgets.js for reliability.
 */
export function TweetEmbed({ url }: { url: string }) {
  const tweetId = getTweetIdFromUrl(url);

  if (!tweetId) {
    return (
      <div className="mt-3 w-full max-w-[400px] pl-0 sm:pl-16">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#666] hover:text-[#333]"
        >
          View on X →
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 w-full max-w-[400px] pl-0 sm:pl-16 [&_.react-tweet-theme]:min-w-0">
      <div style={{ zoom: 0.9 }}>
        <Tweet id={tweetId} />
      </div>
    </div>
  );
}
