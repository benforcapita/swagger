/**
 * Track component represents a track in the video editor.
 * It allows users to add scenes, trim scenes, play/pause the video, and navigate through the scenes.
 */
import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Preview from './Preview';
import Cursor from './Cursor';
import { DroppedScene } from '../interfaces/DroppedScene';
import { scenes } from '../consts';
import SceneItem from './SceneItem';
import Ruler from './Ruler';

/**
 * Track component
 */
const Track: React.FC = () => {
  const [droppedScenes, setDroppedScenes] = useState<DroppedScene[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mode, setMode] = useState<'dnd' | 'trim'>('dnd'); // Mode selection
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'scene',
    drop: (item: { id: number }) => addSceneToTrack(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: () => mode === 'dnd', // Enable drop only in DnD mode
  });

  /**
   * Adds a scene to the track.
   * @param id - The ID of the scene to add.
   */
  const addSceneToTrack = (id: number) => {
    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      const uniqueId = `${scene.id}-${Date.now()}`;
      setDroppedScenes(prevScenes => [...prevScenes, { ...scene, uniqueId, leftTrim: 0, rightTrim: scene.duration }]);
    }
  };

  /**
   * Moves a scene within the track.
   * @param dragIndex - The index of the scene being dragged.
   * @param hoverIndex - The index of the scene being hovered over.
   */
  const moveScene = (dragIndex: number, hoverIndex: number) => {
    const dragScene = droppedScenes[dragIndex];
    const updatedScenes = [...droppedScenes];
    updatedScenes.splice(dragIndex, 1);
    updatedScenes.splice(hoverIndex, 0, dragScene);
    setDroppedScenes(updatedScenes);
  };

  /**
   * Handles trimming of a scene.
   * @param index - The index of the scene being trimmed.
   * @param newLeftTrim - The new left trim value.
   * @param newRightTrim - The new right trim value.
   */
  const handleTrim = (index: number, newLeftTrim: number, newRightTrim: number) => {
    setDroppedScenes(prevScenes => {
      const updatedScenes = [...prevScenes];
      const trimmedScene = { ...updatedScenes[index], leftTrim: newLeftTrim, rightTrim: newRightTrim };
      updatedScenes[index] = trimmedScene;
      return updatedScenes;
    });
  };

  /**
   * Handles the play/pause button click.
   */
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  /**
   * Handles the end of a scene.
   */
  const handleSceneEnd = () => {
    if (currentSceneIndex < droppedScenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentSceneIndex(0);
    }
  };

  /**
   * Handles the time update of the video.
   * @param time - The current time of the video in seconds.
   */
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  /**
   * Handles the zoom in button click.
   */
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  /**
   * Handles the zoom out button click.
   */
  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  /**
   * Handles the track click event.
   * @param e - The click event.
   */
  const handleTrackClick = (e: React.MouseEvent) => {
    if (trackRef.current) {
      const boundingRect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - boundingRect.left;
      const totalDuration = droppedScenes.reduce((acc, scene) => acc + (scene.rightTrim - scene.leftTrim), 0);
      const newTime = (clickX / boundingRect.width) * totalDuration;
      setCurrentTime(newTime);
      // Find the corresponding scene index
      let accumulatedDuration = 0;
      for (let i = 0; i < droppedScenes.length; i++) {
        accumulatedDuration += droppedScenes[i].rightTrim - droppedScenes[i].leftTrim;
        if (newTime <= accumulatedDuration) {
          setCurrentSceneIndex(i);
          break;
        }
      }
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    }
  };

  const totalDuration = droppedScenes.reduce((acc, scene) => acc + (scene.rightTrim - scene.leftTrim), 0);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  return (
    <div className="track-container p-4 border">
      <div className="mode-controls flex mb-4">
        <button
          className={`mode-button p-2 border ${mode === 'dnd' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMode('dnd')}
        >
          Drag and Drop Mode
        </button>
        <button
          className={`mode-button p-2 border ml-2 ${mode === 'trim' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMode('trim')}
        >
          Trim Mode
        </button>
      </div>
      <Ruler totalDuration={totalDuration} zoomLevel={zoomLevel} />
      <div className={`track ${isOver ? 'bg-gray-200' : ''} p-4 border`} ref={drop} onClick={handleTrackClick} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div className="zoom-controls mb-4">
          <button onClick={handleZoomOut} className="zoom-button p-2 border mr-2">-</button>
          <button onClick={handleZoomIn} className="zoom-button p-2 border">+</button>
        </div>
        <div className="track-content p-4 border" ref={trackRef} style={{ width: '100%' }}>
          {droppedScenes.map((scene, index) => (
            <SceneItem
              key={scene.uniqueId}
              scene={scene}
              index={index}
              moveScene={moveScene}
              zoomLevel={zoomLevel}
              onTrim={handleTrim}
              mode={mode}
            />
          ))}
        </div>
      </div>
      <button onClick={handlePlayPause} className="play-button mt-4 p-2 border">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <Cursor position={currentTime} trackWidth={trackRef.current?.clientWidth || 0} totalDuration={totalDuration} />
      <Preview
        sceneUrls={droppedScenes.map(scene => scene.url)}
        currentSceneIndex={currentSceneIndex}
        isPlaying={isPlaying}
        onEnd={handleSceneEnd}
        onTimeUpdate={handleTimeUpdate}
        leftTrim={droppedScenes[currentSceneIndex]?.leftTrim ?? 0}
        rightTrim={droppedScenes[currentSceneIndex]?.rightTrim ?? droppedScenes[currentSceneIndex]?.duration ?? 0}
      />
    </div>
  );
};

export default Track;