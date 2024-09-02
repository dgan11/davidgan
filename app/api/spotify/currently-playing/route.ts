import { NextResponse } from 'next/server';
import SpotifyClient from 'app/utils/SpotifyClient';

export const fetchCache = 'force-no-store';

export async function GET() {
  // Create a new SpotifyClient instance using the refresh token
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);

  // Add these headers to disable caching
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
  };

  try {
    // Use the client to fetch currently playing track
    const data = await client.getCurrentlyPlaying();
    // Return the data as JSON response
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    // Return an error response if something goes wrong
    return NextResponse.json({ error: 'Failed to fetch currently playing' }, { status: 500, headers });
  }
}