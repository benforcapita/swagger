import React from 'react';
import { observer } from 'mobx-react-lite';
import { useDrag } from 'react-dnd';
import videoEditorStore from './stores/VideoEditorStore';
import { Scene } from '../interfaces/Scene';

/**
 * Represents a single scene item in the scene list.
 * @param scene - The scene object containing information about the scene.
 */
const SceneItem: React.FC<{ scene: Scene }> = ({ scene }) => {
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

const SceneList: React.FC = observer(() => {
  return (
    <div className="scene-list">
      {videoEditorStore.scenes.map((scene) => (
        <SceneItem key={scene.id} scene={scene} />
      ))}
    </div>
  );
});

export default SceneList;