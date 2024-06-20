import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import Preview from './Preview';
import Cursor from './Cursor';
import { DroppedScene } from '../interfaces/DroppedScene';
import SceneItem from './SceneItem';
import { scenes } from '../consts';

const Track: React.FC = () => {
  const [droppedScenes, setDroppedScenes] = useState<DroppedScene[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mode, setMode] = useState<'dnd' | 'trim'>('dnd'); // Mode selection
  const trackRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'scene',
    drop: (item: { id: number }) => addSceneToTrack(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: () => mode === 'dnd', // Enable drop only in DnD mode
  });

  const addSceneToTrack = (id: number) => {
    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      const uniqueId = `${scene.id}-${Date.now()}`;
      setDroppedScenes(prevScenes => [...prevScenes, { ...scene, uniqueId, leftTrim: 0, rightTrim: scene.duration }]);
    }
  };

  const moveScene = (dragIndex: number, hoverIndex: number) => {
    const dragScene = droppedScenes[dragIndex];
    const updatedScenes = [...droppedScenes];
    updatedScenes.splice(dragIndex, 1);
    updatedScenes.splice(hoverIndex, 0, dragScene);
    setDroppedScenes(updatedScenes);
  };

  const handleTrim = (index: number, newLeftTrim: number, newRightTrim: number) => {
    setDroppedScenes(prevScenes => {
      const updatedScenes = [...prevScenes];
      const trimmedScene = { ...updatedScenes[index], leftTrim: newLeftTrim, rightTrim: newRightTrim };
      updatedScenes[index] = trimmedScene;
      return updatedScenes;
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSceneEnd = () => {
    if (currentSceneIndex < droppedScenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentSceneIndex(0);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

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
    }
  };

  const totalDuration = droppedScenes.reduce((acc, scene) => acc + (scene.rightTrim - scene.leftTrim), 0);

  return (
  <>
   <div className={`track ${isOver ? 'bg-gray-200' : ''} p-4 border`} ref={drop} onClick={handleTrackClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="zoom-controls mb-4">
          <button onClick={handleZoomOut} className="p-2 border mr-2">-</button>
          <button onClick={handleZoomIn} className="p-2 border">+</button>
        </div>
        <div className="flex mb-4">
        <button
          className={`p-2 border ${mode === 'dnd' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMode('dnd')}
        >
          Drag and Drop Mode
        </button>
        <button
          className={`p-2 border ml-2 ${mode === 'trim' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMode('trim')}
        >
          Trim Mode
        </button>
      </div>
    <div className="p-4 border track">
  
     
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
      <button onClick={handlePlayPause} className="mt-4 p-2 border">
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
    </>
  );
};

export default Track;