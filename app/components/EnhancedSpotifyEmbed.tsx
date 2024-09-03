'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { Spotify } from 'react-spotify-embed';
import SpinningRecord from './SpinningRecord';
import useSpotifyEmbedState from '../hooks/useSpotifyEmbedState';
import axios from 'axios';

interface SpotifyTrackData {
  spotifyLink: string;
  lastPlayedTime: string;
  albumCoverUrl: string;
  trackName: string;
  artistName: string;
}

export default function EnhancedSpotifyEmbed() {
  const [trackData, setTrackData] = useState<SpotifyTrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPlaying = useSpotifyEmbedState(trackData?.spotifyLink ?? '');

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        // First, try to fetch currently playing
        // const timestamp = new Date().getTime();
        const currentlyPlayingResponse = await axios.get(`/api/spotify/currently-playing`);
        console.log('🎶 currently playing response data: ', currentlyPlayingResponse.data);

        if (currentlyPlayingResponse.data && currentlyPlayingResponse.data.item) {
          const currentTrack = currentlyPlayingResponse.data.item;
          setTrackData({
            spotifyLink: currentTrack.external_urls.spotify,
            lastPlayedTime: new Date().toISOString(), // Set to current time
            albumCoverUrl: currentTrack.album.images[0].url,
            trackName: currentTrack.name,
            artistName: currentTrack.artists[0].name,
          });
        } else {
          // If no currently playing track, fetch recently played
          const recentlyPlayedResponse = await axios.get('/api/spotify/recently-played');
          console.log('🎺 recently played response: ', recentlyPlayedResponse.data);
          setTrackData(recentlyPlayedResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch track data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackData();
  }, []);

  if (isLoading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!trackData) return <div>No recent track found</div>;

  const lastPlayedDate = new Date(trackData.lastPlayedTime);
  const minutesSinceLastPlayed = differenceInMinutes(new Date(), lastPlayedDate);
  
  const isListeningNow = minutesSinceLastPlayed <= 10;
  const playStatus = isListeningNow
    ? "Listening now"
    : `Last played ${formatDistanceToNow(lastPlayedDate)}`;


  return (
    <div className="bg-f1 rounded-xl shadow-md overflow-hidden">
      <Spotify wide link={trackData.spotifyLink} frameBorder="0" allow="encrypted-media" />
      <div className="px-2 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <div className={`w-3 h-3 rounded-full mr-2 ${isListeningNow ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span>{playStatus}</span>
          </div>
        </div>
        <div className="ml-4 relative left-[32px] text-a7">
          <SpinningRecord size={60} image={trackData.albumCoverUrl} isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
}