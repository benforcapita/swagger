import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  sceneUrls: string[];
  currentSceneIndex: number;
  isPlaying: boolean;
  onEnd: () => void;
  onTimeUpdate: (time: number) => void;
  leftTrim: number;
  rightTrim: number;
}

const Preview: React.FC<PreviewProps> = ({ sceneUrls, currentSceneIndex, isPlaying, onEnd, onTimeUpdate, leftTrim, rightTrim }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = leftTrim;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentSceneIndex, isPlaying, leftTrim]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= rightTrim) {
        videoRef.current.pause();
        onEnd();
      }
    }
  };

  return (
    <div className="preview">
      <video
        ref={videoRef}
        src={sceneUrls[currentSceneIndex]}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnd}
        controls
        className="w-full h-full"
      />
    </div>
  );
};

export default Preview;