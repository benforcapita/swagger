import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import videoEditorStore from './stores/VideoEditorStore';

// Preview component
/**
 * Component that displays a preview of the video editor.
 * It plays the video with the scenes added by the user.
 * It updates the current scene based on the video time.
 * It handles the end of the video and stops playback.
 * It resets the current scene index when playback is stopped.
 * @component
 * @observer
 * @returns {JSX.Element}
 * 
 */
const Preview: React.FC = observer(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { droppedScenes, isPlaying, handleTimeUpdate, handleSceneEnd } = videoEditorStore;
  const [currentSegmentIndex, setCurrentSegmentIndex] = React.useState(0);

  useEffect(() => {
    if (videoRef.current && droppedScenes[currentSegmentIndex]) {
      videoRef.current.src = droppedScenes[currentSegmentIndex].url;
      videoRef.current.currentTime = droppedScenes[currentSegmentIndex].leftTrim;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentSegmentIndex, isPlaying, droppedScenes]);

  const handleTimeUpdateWrapper = () => {
    if (videoRef.current) {
      const currentScene = droppedScenes[currentSegmentIndex];
      handleTimeUpdate(videoRef.current.currentTime);

      if (videoRef.current.currentTime >= currentScene.rightTrim) {
        if (currentSegmentIndex < droppedScenes.length - 1) {
          setCurrentSegmentIndex(currentSegmentIndex + 1);
        } else {
          videoRef.current.pause();
          handleSceneEnd();
        }
      }
    }
  };

  const handleEnded = () => {
    if (currentSegmentIndex < droppedScenes.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    } else {
      handleSceneEnd();
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setCurrentSegmentIndex(0);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && droppedScenes[currentSegmentIndex]) {
      videoRef.current.currentTime = droppedScenes[currentSegmentIndex].leftTrim;
    }
  }, [currentSegmentIndex, droppedScenes]);

  if (droppedScenes.length === 0 || !droppedScenes[currentSegmentIndex]) {
    return <div className="video-preview">No scenes available</div>;
  }

  return (
    <div className="video-preview">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdateWrapper}
        onEnded={handleEnded}
        controls
        className="w-full h-full"
      />
    </div>
  );
});

export default Preview;