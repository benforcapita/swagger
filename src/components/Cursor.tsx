import React from 'react';
import { observer } from 'mobx-react-lite';
import videoEditorStore from './stores/VideoEditorStore';

const Cursor: React.FC = observer(() => {
  const cursorPosition = (videoEditorStore.currentTime / videoEditorStore.totalDuration) * videoEditorStore.trackWidth;

  return (
    <div className="relative">
      <div
        className="absolute cursor-marker h-full bg-red-500"
        style={{ left: `${cursorPosition}px`, width: '2px' }}
      />
    </div>
  );
});

export default Cursor;