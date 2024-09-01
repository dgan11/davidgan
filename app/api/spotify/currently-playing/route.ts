import { NextResponse } from 'next/server';
import SpotifyClient from 'app/utils/SpotifyClient';

export async function GET() {
  const client = new SpotifyClient(process.env.SPOTIFY_REFRESH_TOKEN!);

  try {
    const data = await client.getCurrentlyPlaying();
    console.log('🍟 api data: ', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return NextResponse.json({ error: 'Failed to fetch currently playing' }, { status: 500 });
  }
}