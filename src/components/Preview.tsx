import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import videoEditorStore from './stores/VideoEditorStore';

const Preview: React.FC = observer(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { droppedScenes, currentSceneIndex, isPlaying, handleTimeUpdate, handleSceneEnd } = videoEditorStore;

  useEffect(() => {
    if (videoRef.current && droppedScenes[currentSceneIndex]) {
      videoRef.current.currentTime = droppedScenes[currentSceneIndex].leftTrim;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentSceneIndex, isPlaying, droppedScenes]);

  const handleTimeUpdateWrapper = () => {
    if (videoRef.current) {
      handleTimeUpdate(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= droppedScenes[currentSceneIndex].rightTrim) {
        videoRef.current.pause();
        handleSceneEnd();
      }
    }
  };

  if (droppedScenes.length === 0 || !droppedScenes[currentSceneIndex]) {
    return <div className="video-preview">No scenes available</div>;
  }

  return (
    <div className="video-preview">
      <video
        ref={videoRef}
        src={droppedScenes[currentSceneIndex].url}
        onTimeUpdate={handleTimeUpdateWrapper}
        onEnded={handleSceneEnd}
        controls
        className="w-full h-full"
      />
    </div>
  );
});

export default Preview;