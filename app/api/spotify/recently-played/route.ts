import { NextResponse } from 'next/server';
import SpotifyClient from 'app/utils/SpotifyClient';

export async function GET() {
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);

  try {
    const data = await client.getRecentlyPlayed();
    console.log('🍔 recently played data.items: ', data.items);
    if (data.items && data.items.length > 0) {
      const mostRecent = data.items[0];
      return NextResponse.json({
        spotifyLink: mostRecent.track.external_urls.spotify,
        lastPlayedTime: mostRecent.played_at,
        albumCoverUrl: mostRecent.track.album.images[0].url,
        trackName: mostRecent.track.name,
        artistName: mostRecent.track.artists[0].name,
      });
    } else {
      return NextResponse.json({ error: 'No recently played tracks found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return NextResponse.json({ error: 'Failed to fetch recently played' }, { status: 500 });
  }
}