/**
 * Represents a preview component for displaying video scenes.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.sceneUrls - The URLs of the video scenes.
 * @param {number} props.currentSceneIndex - The index of the current scene.
 * @param {boolean} props.isPlaying - Indicates whether the video is playing.
 * @param {Function} props.onEnd - The callback function to be called when the video ends.
 * @param {Function} props.onTimeUpdate - The callback function to be called when the video time updates.
 * @param {number} props.leftTrim - The left trim value of the video.
 * @param {number} props.rightTrim - The right trim value of the video.
 * @returns {JSX.Element} The rendered Preview component.
 */
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
    <div className="video-preview">
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