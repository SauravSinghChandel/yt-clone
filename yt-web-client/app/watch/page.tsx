/*'use client';
import { useSearchParams } from "next/navigation";

function WatchContent() {
    const videoPrefix = "https://storage.googleapis.com/jb527-yt-processed-videos/";

        const videoSrc = useSearchParams().get("v");

    return (
        <div>
        <h1>Watch Page</h1>
        {
            <video controls src={videoPrefix + videoSrc}/>
        }
        </div>
    )

}

export default function Watch() {

    return (
        <WatchContent/>
    )
}
*/

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function WatchContent() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const videoId = searchParams.get("v");
    if (videoId) {
      // Simulate fetching video data based on videoId (replace with your actual fetch logic)
      setTimeout(() => {
        setVideoSrc(`https://storage.googleapis.com/jb527-yt-processed-videos/${videoId}`); 
      }, 1000); // Simulate a 1-second delay
    }
  }, [searchParams]); 

  return (
    <div>
      <h1>Watch Page</h1>
      {videoSrc ? (
        <video controls src={videoSrc} />
      ) : (
        <div>Loading video...</div> 
      )}
    </div>
  );
}

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <WatchContent />
    </Suspense>
  );
}
