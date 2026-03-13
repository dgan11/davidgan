'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { Spotify } from 'react-spotify-embed';
import SpinningRecord from './SpinningRecord';
import useSpotifyEmbedState from '../hooks/useSpotifyEmbedState';
import { getCurrentlyPlaying, getRecentlyPlayed } from '../actions/spotifyActions';

interface SpotifyTrackData {
  spotifyLink: string;
  lastPlayedTime: string;
  albumCoverUrl: string;
  trackName: string;
  artistName: string;
}

type SpotifyVariant = 'default' | 'minimal' | 'compact';

export default function EnhancedSpotifyEmbed({ variant = 'default' }: { variant?: SpotifyVariant }) {
  const [trackData, setTrackData] = useState<SpotifyTrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPlaying = useSpotifyEmbedState(trackData?.spotifyLink ?? '');

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        // First, try to fetch currently playing
        const currentlyPlayingData = await getCurrentlyPlaying();
        console.log('🎶 currently playing data: ', currentlyPlayingData);

        if (currentlyPlayingData && currentlyPlayingData.item) {
          const currentTrack = currentlyPlayingData.item;
          setTrackData({
            spotifyLink: currentTrack.external_urls.spotify,
            lastPlayedTime: new Date().toISOString(),
            albumCoverUrl: currentTrack.album.images[0].url,
            trackName: currentTrack.name,
            artistName: currentTrack.artists[0].name,
          });
        } else {
          // If no currently playing track, fetch recently played
          const recentlyPlayedData = await getRecentlyPlayed();
          console.log('🎺 recently played data: ', recentlyPlayedData);
          setTrackData(recentlyPlayedData);
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

  if (variant === 'compact') {
    return (
      <div
        className="max-w-[340px] mx-auto rounded-xl overflow-hidden shadow-sm border border-[#e8e6e2]"
        style={{ backgroundColor: '#f0eeeb' }}
      >
        <a
          href={trackData.spotifyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#ebe9e6] transition-colors"
        >
          <div className="flex-shrink-0 text-[#999]">
            <SpinningRecord size={80} image={trackData.albumCoverUrl} isPlaying={isPlaying} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-[#333] truncate font-medium">
              {trackData.trackName}
            </p>
            <p className="text-[12px] text-[#666] truncate italic">
              {trackData.artistName}
            </p>
          </div>
        </a>
        <Spotify
          link={trackData.spotifyLink}
          width={340}
          height={80}
          frameBorder={0}
          allow="encrypted-media"
        />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="rounded-xl overflow-hidden shadow-sm">
        <Spotify wide link={trackData.spotifyLink} frameBorder="0" allow="encrypted-media" />
      </div>
    );
  }

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