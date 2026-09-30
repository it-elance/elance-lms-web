'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { storeWatchProgressApi } from '@/services/api.service';
import { ANALYTICS_QUERY_KEY } from '@/hooks/useAnalyticsData';
import { HOME_QUERY_KEY } from '@/hooks/useHomeData';
import type { TPStreamsPlayer } from '@/types/player.types';

const POLL_INTERVAL_MS = 1000;
const REPORT_EVERY_SECONDS = 30;
// A bigger jump between two polls is a seek, not watching
const MAX_PLAYBACK_STEP_SECONDS = 3;
const COMPLETION_RATIO = 0.95;

interface UseWatchProgressArgs {
  player: TPStreamsPlayer | null;
  videoId?: string;
  batchId?: string;
  duration?: number;
}

// Reports playback position and seconds watched to the backend, which feeds
// continue watching, lecture completion and the analytics page.
export const useWatchProgress = ({
  player,
  videoId,
  batchId,
  duration = 0,
}: UseWatchProgressArgs) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!player || !videoId || !batchId) return;

    let isActive = true;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let lastPosition: number | null = null;
    let unsentSeconds = 0;
    let isCompleted = false;
    let isCompletionReported = false;

    const report = () => {
      if (lastPosition === null) return;
      const reportsCompletion = isCompleted && !isCompletionReported;
      if (unsentSeconds < 1 && !reportsCompletion) return;

      const watchTime = Math.round(unsentSeconds);
      unsentSeconds = 0;
      isCompletionReported = isCompleted;

      storeWatchProgressApi({
        videoId,
        batchId,
        seedPosition: Math.floor(lastPosition),
        watchTime,
        isCompleted,
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY });
        })
        .catch(() => {
          // Retry with the next report
          unsentSeconds += watchTime;
          if (reportsCompletion) isCompletionReported = false;
        });
    };

    const markCompleted = () => {
      isCompleted = true;
      report();
    };

    const tick = async () => {
      let position: number;
      try {
        position = await player.getCurrentTime();
      } catch {
        return;
      }
      if (!isActive) return;

      const step = lastPosition === null ? 0 : position - lastPosition;
      lastPosition = position;

      if (step > 0 && step <= MAX_PLAYBACK_STEP_SECONDS) {
        unsentSeconds += step;
      }

      if (
        !isCompleted &&
        duration > 0 &&
        position >= duration * COMPLETION_RATIO
      ) {
        markCompleted();
      } else if (
        unsentSeconds >= REPORT_EVERY_SECONDS ||
        (step === 0 && unsentSeconds > 0) // paused
      ) {
        report();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') report();
    };

    // Player methods wait for the video to load, so only start polling once
    // it has, instead of queueing calls that may never resolve.
    player
      .loaded()
      .then(() => {
        if (!isActive) return;
        intervalId = setInterval(tick, POLL_INTERVAL_MS);
        player.on('ended', markCompleted);
      })
      .catch(() => {
        // The video failed to load, so there is nothing to track
      });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActive = false;
      clearInterval(intervalId);
      if (intervalId) player.off('ended', markCompleted);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      report();
    };
  }, [player, videoId, batchId, duration, queryClient]);
};
