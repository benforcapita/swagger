import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

interface Scene {
  id: number;
  name: string;
  duration: number;
}

const scenes: Scene[] = [
  { id: 1, name: 'Scene 1', duration: 3 },
  { id: 2, name: 'Scene 2', duration: 4.2 },
  { id: 3, name: 'Scene 3', duration: 5.5 },
];

interface DroppedScene extends Scene {}

const Track: React.FC = () => {
  const [droppedScenes, setDroppedScenes] = useState<DroppedScene[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'scene',
    drop: (item: { id: number }) => addSceneToTrack(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addSceneToTrack = (id: number) => {
    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      setDroppedScenes(prevScenes => [...prevScenes, scene]);
    }
  };

  return (
    <div ref={drop} className={`track ${isOver ? 'bg-gray-200' : ''} p-4 border`}>
      {droppedScenes.map((scene, index) => (
        <div key={index} className="track-item p-2 border mb-2">
          {scene.name} (Duration: {scene.duration}s)
        </div>
      ))}
    </div>
  );
};

export default Track;