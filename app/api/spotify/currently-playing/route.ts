import { NextResponse } from 'next/server';
import SpotifyClient from 'app/utils/SpotifyClient';

export async function GET() {
  // Create a new SpotifyClient instance using the refresh token
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);

  try {
    // Use the client to fetch currently playing track
    const data = await client.getCurrentlyPlaying();
    // console.log('🍟 api data: ', data);
    // Return the data as JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    // Return an error response if something goes wrong
    return NextResponse.json({ error: 'Failed to fetch currently playing' }, { status: 500 });
  }
}