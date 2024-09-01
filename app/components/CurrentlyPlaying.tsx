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
        // Make a request to our API route
        const response = await axios.get('/api/spotify/currently-playing');
        console.log('🌱 response.data: ', response.data);
        // Update the track state with the fetched data
        setTrack(response.data.item);
      } catch (err) {
        setError('Failed to fetch currently playing track');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data immediately
    fetchCurrentlyPlaying();
    // Set up an interval to fetch every 30 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Render loading state
  if (isLoading) return <div>Loading...</div>;
  // Render error state
  if (error) return <div>Error: {error}</div>;
  // Render when no track is playing
  if (!track) return <div>No track currently playing</div>;

  // Render the currently playing track
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