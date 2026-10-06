'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import type { TPStreamsPlayer } from '@/types/player.types';

interface VideoPlayerProps {
  assetId: string;
  accessToken: string;
  playerRef?: RefObject<TPStreamsPlayer | null>;
  // Video Gallery id, batch id and duration (seconds) for progress reporting
  videoGalleryId?: string;
  batchId?: string;
  duration?: number;
  // Seconds to continue from, where the student last stopped
  resumePosition?: number;
}

const tpStreamsOrgId = process.env.NEXT_PUBLIC_TPSTREAMS_ORG_ID;
const PLAYER_SDK_URL = 'https://static.tpstreams.com/static/js/player_v2.js';
const PLAYER_TIME_TIMEOUT_MS = 1000;

// Falls back to 0 when the player never became ready (e.g. playback not
// started, or the SDK missed the iframe's `loadeddata` event).
export const getPlayerCurrentTime = async (
  player: TPStreamsPlayer | null
): Promise<number> => {
  if (!player) return 0;

  const timeout = new Promise<number>((resolve) =>
    setTimeout(() => resolve(0), PLAYER_TIME_TIMEOUT_MS)
  );

  try {
    return await Promise.race([player.getCurrentTime(), timeout]);
  } catch {
    return 0;
  }
};

const VideoPlayer = ({
  assetId,
  accessToken,
  playerRef,
  videoGalleryId,
  batchId,
  duration,
  resumePosition,
}: VideoPlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [player, setPlayer] = useState<TPStreamsPlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useWatchProgress({ player, videoId: videoGalleryId, batchId, duration });

  // Continue from the last position once the student presses play. Seeking
  // on load would start the video by itself (setCurrentTime plays a video
  // that hasn't started), so wait for play, or seek now if it already began.
  useEffect(() => {
    if (!player || !resumePosition) return;

    let isDone = false;
    const resume = () => {
      if (isDone) return;
      isDone = true;
      player.setCurrentTime(resumePosition).catch(() => {
        // Out of range; keep playing from where it is
      });
    };

    player.on('play', resume);
    player
      .getPaused()
      .then((isPaused) => {
        if (!isPaused) resume();
      })
      .catch(() => {
        // The video failed to load, so there is nothing to resume
      });

    return () => {
      isDone = true;
      player.off('play', resume);
    };
  }, [player, resumePosition]);

  const src = `https://app.tpstreams.com/embed/${tpStreamsOrgId}/${assetId}/?access_token=${accessToken}`;

  // The SDK only knows the player is ready once it hears the iframe's
  // `loadeddata` event, so attach it as soon as the iframe is mounted.
  const attachPlayer = () => {
    if (!iframeRef.current || !window.Testpress) return;
    const tpPlayer = new window.Testpress.Player(iframeRef.current);
    setPlayer(tpPlayer);
    if (playerRef) playerRef.current = tpPlayer;
  };

  useEffect(() => {
    if (!playerRef) return;
    return () => {
      playerRef.current = null;
    };
  }, [playerRef]);

  return (
    <>
      <Script src={PLAYER_SDK_URL} onReady={attachPlayer} />

      {!isLoaded && (
        <div className="absolute inset-0 bg-(--color-bg-secondary) animate-pulse z-10" />
      )}

      <iframe
        ref={iframeRef}
        src={src}
        title="Lecture video player"
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
};

export default VideoPlayer;
