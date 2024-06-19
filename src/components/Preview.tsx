import React, { useRef, useEffect } from 'react';

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
      const currentTime = videoRef.current.currentTime;
      if (currentTime >= rightTrim) {
        videoRef.current.pause();
        onEnd();
      } else {
        onTimeUpdate(currentTime);
      }
    }
  };

  return (
    <video
      ref={videoRef}
      src={sceneUrls[currentSceneIndex]}
      onTimeUpdate={handleTimeUpdate}
      onEnded={onEnd}
      controls
    />
  );
};

export default Preview;