

import { useRef, useState, useEffect } from "react";
import { SceneItemProps } from "../interfaces/SceneItemProps";
import { useDrag, useDrop } from "react-dnd";



/**
 * Represents a scene item in the video editor.
 *
 * @component
 * @param {SceneItemProps} props - The props for the SceneItem component.
 * @param {Scene} props.scene - The scene object.
 * @param {number} props.index - The index of the scene item.
 * @param {Function} props.moveScene - The function to move the scene item.
 * @param {number} props.zoomLevel - The zoom level of the video editor.
 * @param {Function} props.onTrim - The function to handle trimming of the scene item.
 * @param {string} props.mode - The mode of the video editor.
 * @returns {JSX.Element} The rendered SceneItem component.
 */
const SceneItem: React.FC<SceneItemProps> = ({ scene, index, moveScene, zoomLevel, onTrim, mode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [leftTrim, setLeftTrim] = useState(scene.leftTrim || 0);
  const [rightTrim, setRightTrim] = useState(scene.rightTrim || scene.duration);
  const [initialLeftTrim, setInitialLeftTrim] = useState(scene.leftTrim || 0);
  const [initialRightTrim, setInitialRightTrim] = useState(scene.rightTrim || scene.duration);

  const [, drop] = useDrop({
    accept: 'sceneItem',
    hover(item: { index: number }, monitor) {
      if (!ref.current || isResizing || mode !== 'dnd') {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      moveScene(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'sceneItem',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => mode === 'dnd',
  });

  drag(drop(ref));

  const handleMouseDown = (e: React.MouseEvent, handle: 'left' | 'right') => {
    if (mode !== 'trim') return;

    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    setInitialLeftTrim(leftTrim);
    setInitialRightTrim(rightTrim);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const width = ref.current?.offsetWidth || 0;
      const durationPerPixel = scene.duration / width;
      let updatedLeftTrim = initialLeftTrim;
      let updatedRightTrim = initialRightTrim;

      if (handle === 'right') {
        updatedRightTrim = initialRightTrim + deltaX * durationPerPixel;
        updatedRightTrim = Math.min(updatedRightTrim, scene.duration);
        updatedRightTrim = Math.max(updatedRightTrim, leftTrim);
      } else {
        updatedLeftTrim = initialLeftTrim + deltaX * durationPerPixel;
        updatedLeftTrim = Math.max(updatedLeftTrim, 0);
        updatedLeftTrim = Math.min(updatedLeftTrim, rightTrim);
      }
      setLeftTrim(updatedLeftTrim);
      setRightTrim(updatedRightTrim);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onTrim(index, leftTrim, rightTrim);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    setRightTrim(scene.duration);
  }, [scene.duration]);

  useEffect(() => {
    if (!isResizing) {
      setInitialLeftTrim(leftTrim);
      setInitialRightTrim(rightTrim);
    }
  }, [isResizing, leftTrim, rightTrim]);

  const fullDuration = scene.duration;
  const trimmedDuration = rightTrim - leftTrim;
  const trimPercentage = (trimmedDuration / fullDuration) * 100;
  const leftTrimPercentage = (leftTrim / fullDuration) * 100;

  return (
    <div
      ref={ref}
      className={`relative track-item ${isDragging ? 'opacity-50' : ''}`}
      style={{ width: '100%', transform: `scaleX(${zoomLevel})`, position: 'relative' }}
    >
      <div
        className="relative scene-content bg-blue-300"
        style={{
          marginLeft: `${leftTrimPercentage}%`,
          width: `${trimPercentage}%`,
        }}
      >
        {mode === 'trim' && (
          <div
            className="absolute left-trim-handle left-0 top-0 h-full w-2 bg-gray-500 cursor-ew-resize"
            style={{ zIndex: isResizing ? 1 : 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
        )}
        <p className="text-center">{scene.name} (Duration: {trimmedDuration.toFixed(2)}s)</p>
        {mode === 'trim' && (
          <div
            className="absolute right-trim-handle right-0 top-0 h-full w-2 bg-gray-500 cursor-ew-resize"
            style={{ zIndex: isResizing ? 1 : 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
        )}
      </div>
    </div>
  );
};

export default SceneItem;