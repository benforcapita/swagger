import { useRef, useState, useEffect } from "react";
import { SceneItemProps } from "../interfaces/SceneItemProps";
import { useDrag, useDrop } from "react-dnd";

const SceneItem: React.FC<SceneItemProps> = ({ scene, index, moveScene, zoomLevel, onTrim, mode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [leftTrim, setLeftTrim] = useState(0);
  const [rightTrim, setRightTrim] = useState(scene.duration);
  const [initialLeftTrim, setInitialLeftTrim] = useState(0);
  const [initialRightTrim, setInitialRightTrim] = useState(scene.duration);

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
      const newDuration = rightTrim - leftTrim;
      onTrim(index, newDuration);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    setRightTrim(scene.duration);
  }, [scene.duration]);

  const fullDuration = scene.duration;
  const trimmedDuration = rightTrim - leftTrim;
  const trimPercentage = (trimmedDuration / fullDuration) * 100;
  const leftTrimPercentage = (leftTrim / fullDuration) * 100;

  return (
    <div
      ref={ref}
      className={`relative track-item p-2 border mb-2 ${isDragging ? 'opacity-50' : ''}`}
      style={{ width: '100%', transform: `scaleX(${zoomLevel})`, position: 'relative' }}
    >
      {mode === 'trim' && (
        <div
          className="absolute left-0 h-full bg-gray-500 cursor-ew-resize top-0"
          style={{ width: `${leftTrimPercentage}%`, zIndex: isResizing ? 1 : 0 }}
          onMouseDown={(e) => handleMouseDown(e, 'left')}
        />
      )}
      <div
        className="relative bg-blue-300"
        style={{
          marginLeft: `${leftTrimPercentage}%`,
          width: `${trimPercentage}%`,
        }}
      >
        {scene.name} (Duration: {trimmedDuration.toFixed(2)}s)
        {mode === 'trim' && (
          <div
            className="absolute right-0 top-0 h-full w-2 bg-gray-500 cursor-ew-resize"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
            style={{ zIndex: isResizing ? 1 : 0 }}
          />
        )}
      </div>
      {mode === 'trim' && (
        <div
          className="absolute right-0 h-full bg-gray-500 cursor-ew-resize top-0"
          style={{ width: `${(1 - rightTrim / fullDuration) * 100}%`, right: 0, zIndex: isResizing ? 1 : 0 }}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />
      )}
    </div>
  );
};

export default SceneItem;