'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { PlayButtonV2 } from './PlayButtonV2';
import { getCurrentlyPlaying, getRecentlyPlayed } from '../../actions/spotifyActions';

interface SpotifyTrackData {
  spotifyLink: string;
  lastPlayedTime: string;
  albumCoverUrl: string;
  trackName: string;
  artistName: string;
}

interface SpotifyPlaybackEvent {
  data?: {
    isPaused?: boolean;
    playingURI?: string;
  };
}

interface SpotifyEmbedController {
  addListener: (eventName: string, callback: (event?: SpotifyPlaybackEvent) => void) => void;
  destroy: () => void;
  togglePlay: () => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: {
      uri: string;
      width?: number | string;
      height?: number | string;
    },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    __spotifyIframeApi?: SpotifyIframeApi;
    __spotifyIframeApiPromise?: Promise<SpotifyIframeApi>;
  }
}

function loadSpotifyIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Spotify iframe API can only load in the browser.'));
  }

  if (window.__spotifyIframeApi) {
    return Promise.resolve(window.__spotifyIframeApi);
  }

  if (window.__spotifyIframeApiPromise) {
    return window.__spotifyIframeApiPromise;
  }

  window.__spotifyIframeApiPromise = new Promise<SpotifyIframeApi>((resolve, reject) => {
    const handleReady = (api: SpotifyIframeApi) => {
      window.__spotifyIframeApi = api;
      window.__spotifyIframeApiPromise = Promise.resolve(api);
      resolve(api);
    };

    window.onSpotifyIframeApiReady = handleReady;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
    );

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = () => {
      window.__spotifyIframeApiPromise = undefined;
      reject(new Error('Failed to load Spotify iframe API.'));
    };
    document.body.appendChild(script);
  });

  return window.__spotifyIframeApiPromise;
}

function spotifyUrlToUri(link: string) {
  if (!link) return null;

  try {
    const url = new URL(link);
    const [, contentType, contentId] = url.pathname.split('/');

    if (!contentType || !contentId) {
      return null;
    }

    return `spotify:${contentType}:${contentId}`;
  } catch {
    return null;
  }
}

export function Spotify() {
  const [trackData, setTrackData] = useState<SpotifyTrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const iframeHostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const currentlyPlayingData = await getCurrentlyPlaying();

        if (currentlyPlayingData?.item) {
          const currentTrack = currentlyPlayingData.item;
          setTrackData({
            spotifyLink: currentTrack.external_urls.spotify,
            lastPlayedTime: new Date().toISOString(),
            albumCoverUrl: currentTrack.album.images[0].url,
            trackName: currentTrack.name,
            artistName: currentTrack.artists[0].name,
          });
          return;
        }

        const recentlyPlayedData = await getRecentlyPlayed();
        setTrackData(recentlyPlayedData);
      } catch (error) {
        setFetchError('Failed to fetch track data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackData();
  }, []);

  const spotifyUri = useMemo(
    () => spotifyUrlToUri(trackData?.spotifyLink ?? ''),
    [trackData?.spotifyLink]
  );

  useEffect(() => {
    const hostElement = iframeHostRef.current;

    if (!spotifyUri || !hostElement) {
      return;
    }

    let isCancelled = false;
    let activeController: SpotifyEmbedController | null = null;

    setIsPlaying(false);

    loadSpotifyIframeApi()
      .then((api) => {
        if (isCancelled) {
          return;
        }

        const mountNode = document.createElement('div');
        hostElement.replaceChildren(mountNode);

        api.createController(
          mountNode,
          {
            uri: spotifyUri,
            width: 320,
            height: 80,
          },
          (controller) => {
            if (isCancelled) {
              controller.destroy();
              return;
            }

            activeController = controller;
            controllerRef.current = controller;

            controller.addListener('playback_started', () => {
              if (!isCancelled) {
                setIsPlaying(true);
              }
            });

            controller.addListener('playback_update', (event) => {
              if (isCancelled || !event?.data) {
                return;
              }

              if (typeof event.data.isPaused === 'boolean') {
                setIsPlaying(!event.data.isPaused);
              }
            });
          }
        );
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
      controllerRef.current = null;
      activeController?.destroy();
      hostElement.replaceChildren();
    };
  }, [spotifyUri]);

  if (isLoading) {
    return (
      <div
        className="relative mx-auto w-full min-w-[280px] max-w-[340px] rounded-xl overflow-hidden shadow-sm border border-[#eae6e0] animate-pulse"
        style={{ backgroundColor: '#f3f0ea' }}
      >
        <div className="flex w-full min-w-0 items-center gap-5 px-3 py-2 pr-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-[#eae6e0]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-[75%] rounded bg-[#eae6e0]" />
            <div className="h-3 w-1/2 rounded bg-[#eae6e0]" />
            <div className="h-2.5 w-1/3 rounded bg-[#eae6e0]" />
          </div>
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#eae6e0]" />
        </div>
      </div>
    );
  }
  if (fetchError) return <div>Error: {fetchError}</div>;
  if (!trackData) return <div>No recent track found</div>;

  const lastPlayedDate = new Date(trackData.lastPlayedTime);
  const isListeningNow = differenceInMinutes(new Date(), lastPlayedDate) <= 10;
  const sublabel = isListeningNow
    ? 'Listening now'
    : `Last played ${formatDistanceToNow(lastPlayedDate)} ago`;

  const handleTogglePlayback = () => {
    if (controllerRef.current) {
      setIsPlaying((prev) => !prev);
      controllerRef.current.togglePlay();
      return;
    }

    window.open(trackData.spotifyLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="relative mx-auto w-full min-w-[280px] max-w-[340px] rounded-xl overflow-hidden shadow-sm border border-[#eae6e0]"
      style={{ backgroundColor: '#f3f0ea' }}
    >
      <div
        ref={iframeHostRef}
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <div className="px-2 py-1">
        <button
          type="button"
          onClick={handleTogglePlayback}
          className="flex w-full min-w-0 items-center gap-5 px-1 py-0.5 pr-2 text-left"
          aria-label={isPlaying ? 'Pause Spotify playback' : 'Play Spotify track'}
        >
          <PlayButtonV2
            albumCoverUrl={trackData.albumCoverUrl}
            isPlaying={isPlaying}
            trackName={trackData.trackName}
            artistName={trackData.artistName}
            sublabel={sublabel}
          />
        </button>
      </div>
    </div>
  );
}
