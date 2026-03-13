'use client';

import { TweetEmbed } from '../TweetEmbed';

const ANYSPHERE_TWEET_URL = 'https://x.com/davidgan/status/1936614153768321255';

export function AnysphereDescV2() {
  return (
    <div>
      <p className="opacity-75">building cursor</p>
      <TweetEmbed url={ANYSPHERE_TWEET_URL} />
    </div>
  );
}
