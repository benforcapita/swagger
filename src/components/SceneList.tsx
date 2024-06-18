import React from 'react';
import { useDrag } from 'react-dnd';

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

interface SceneItemProps {
  scene: Scene;
}

const SceneItem: React.FC<SceneItemProps> = ({ scene }) => {
  const [, drag] = useDrag(() => ({
    type: 'scene',
    item: { id: scene.id },
  }));

  return (
    <div ref={drag} className="scene-item p-2 border mb-2">
      {scene.name} (Duration: {scene.duration}s)
    </div>
  );
};

const SceneList: React.FC = () => {
  return (
    <div className="scene-list">
      {scenes.map(scene => (
        <SceneItem key={scene.id} scene={scene} />
      ))}
    </div>
  );
};

export default SceneList;