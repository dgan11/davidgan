'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Track {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await axios.get('/api/spotify/currently-playing');
        console.log('🌱 resonse.data: ', response.data);
        setTrack(response.data.item);
      } catch (err) {
        setError('Failed to fetch currently playing track');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentlyPlaying();
    // Set up an interval to fetch every 30 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!track) return <div>No track currently playing</div>;

  return (
    <div>
      <h2>Currently Playing</h2>
      <img src={track.album.images[0].url} alt={track.album.name} width="200" height="200" />
      <p>Track: {track.name}</p>
      <p>Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
      <p>Album: {track.album.name}</p>
    </div>
  );
}