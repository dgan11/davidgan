import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Fix to pause and resume the Spotify embed when the user pauses and resumes a song
 * have to catch the event (network log) when the user pressses pause/play
 */

function useSpotifyEmbedState(spotifyLink: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const lastPlayStateRef = useRef<boolean>(false);

  const handlePlaybackUpdate = useCallback((isPaused: boolean) => {
    const newPlayState = !isPaused;
    if (newPlayState !== lastPlayStateRef.current) {
      setIsPlaying(newPlayState);
      lastPlayStateRef.current = newPlayState;
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'playback_update') {
        handlePlaybackUpdate(event.data.payload.isPaused);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handlePlaybackUpdate]);

  useEffect(() => {
    const iframe = document.querySelector('iframe[src^="https://open.spotify.com/embed/"]') as HTMLIFrameElement | null;
    if (iframe) {
      iframeRef.current = iframe;
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            handlePlaybackUpdate(true); // Assume paused when src changes
          }
        });
      });

      observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
      observerRef.current = observer;

      // Set up Intersection Observer
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ command: 'subscribe', channel: 'player' }, '*');
          }
        },
        { threshold: 0.1 }
      );

      intersectionObserver.observe(iframe);

      return () => {
        observer.disconnect();
        intersectionObserver.disconnect();
      };
    }
  }, [spotifyLink, handlePlaybackUpdate]);

  return isPlaying;
}

export default useSpotifyEmbedState;
