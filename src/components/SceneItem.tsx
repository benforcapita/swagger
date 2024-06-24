import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { observer } from 'mobx-react-lite';
import { SceneItemProps } from '../interfaces/SceneItemProps';
import videoEditorStore from './stores/VideoEditorStore';

const SceneItem: React.FC<SceneItemProps> = observer(({ scene, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'sceneItem',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),    canDrag: () => videoEditorStore.mode === 'dnd',
  });

  const [, drop] = useDrop({
    accept: 'sceneItem',
    hover(item: { index: number }) {
      if (!ref.current || videoEditorStore.mode !== 'dnd') return;
      if (item.index !== index) {
        videoEditorStore.moveScene(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  const handleMouseDown = (e: React.MouseEvent, handle: 'left' | 'right') => {
    if (videoEditorStore.mode !== 'trim') return;

    e.stopPropagation();
    const startX = e.clientX;
    const initialLeftTrim = scene.leftTrim;
    const initialRightTrim = scene.rightTrim;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const width = ref.current?.offsetWidth || 0;
      const durationPerPixel = scene.duration / width;
      let updatedLeftTrim = initialLeftTrim;
      let updatedRightTrim = initialRightTrim;

      if (handle === 'right') {
        updatedRightTrim = initialRightTrim + deltaX * durationPerPixel;
        updatedRightTrim = Math.min(updatedRightTrim, scene.duration);
        updatedRightTrim = Math.max(updatedRightTrim, scene.leftTrim);
      } else {
        updatedLeftTrim = initialLeftTrim + deltaX * durationPerPixel;
        updatedLeftTrim = Math.max(updatedLeftTrim, 0);
        updatedLeftTrim = Math.min(updatedLeftTrim, scene.rightTrim);
      }

      videoEditorStore.handleTrim(index, updatedLeftTrim, updatedRightTrim);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const fullDuration = scene.duration;
  const trimmedDuration = scene.rightTrim - scene.leftTrim;
  const trimPercentage = (trimmedDuration / fullDuration) * 100;
  const leftTrimPercentage = (scene.leftTrim / fullDuration) * 100;

  return (
    <div
      ref={ref}
      className={`relative track-item ${isDragging ? 'opacity-50' : ''}`}
      style={{ width: '100%', transform: `scaleX(${videoEditorStore.zoomLevel})`, position: 'relative' }}
    >
      <div
        className="relative scene-content bg-blue-300"
        style={{
          marginLeft: `${leftTrimPercentage}%`,
          width: `${trimPercentage}%`,
        }}
      >
        {videoEditorStore.mode === 'trim' && (
          <div
            className="absolute left-trim-handle left-0 top-0 h-full w-2 bg-gray-500 cursor-ew-resize"
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
        )}
        <p className="text-center">{scene.name} (Duration: {trimmedDuration.toFixed(2)}s)</p>
        {videoEditorStore.mode === 'trim' && (
          <div
            className="absolute right-trim-handle right-0 top-0 h-full w-2 bg-gray-500 cursor-ew-resize"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
        )}
      </div>
    </div>
  );
});

export default SceneItem;