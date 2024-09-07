'use server';

import SpotifyClient from 'app/utils/SpotifyClient';

export async function getCurrentlyPlaying() {
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);
  try {
    const data = await client.getCurrentlyPlaying();
    return data;
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    throw new Error('Failed to fetch currently playing');
  }
}

export async function getRecentlyPlayed() {
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);
  try {
    const data = await client.getRecentlyPlayed();
    if (data.items && data.items.length > 0) {
      const mostRecent = data.items[0];
      return {
        spotifyLink: mostRecent.track.external_urls.spotify,
        lastPlayedTime: mostRecent.played_at,
        albumCoverUrl: mostRecent.track.album.images[0].url,
        trackName: mostRecent.track.name,
        artistName: mostRecent.track.artists[0].name,
      };
    } else {
      throw new Error('No recently played tracks found');
    }
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw new Error('Failed to fetch recently played');
  }
}
