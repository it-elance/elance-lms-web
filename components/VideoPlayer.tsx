'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  assetId: string;
  accessToken: string;
}

const tpStreamsOrgId = process.env.NEXT_PUBLIC_TPSTREAMS_ORG_ID;

const VideoPlayer = ({ assetId, accessToken }: VideoPlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const src = `https://app.tpstreams.com/embed/${tpStreamsOrgId}/${assetId}/?access_token=${accessToken}`;

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-(--color-bg-secondary) animate-pulse z-10" />
      )}

      <iframe
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
