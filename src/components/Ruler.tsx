import React from 'react';
import { observer } from 'mobx-react-lite';
import videoEditorStore from './stores/VideoEditorStore';

const Ruler: React.FC = observer(() => {
  const markers = [];
  const markerWidth = 50 * videoEditorStore.zoomLevel;

  for (let i = 0; i <= videoEditorStore.totalDuration; i++) {
    markers.push(
      <div
        key={i}
        className="flex flex-grow border-r border-gray-300 text-xs text-center items-center justify-center"
        style={{ width: `${markerWidth}px` }}
      >
        <div>{i}s</div>
      </div>
    );
  }

  return (
    <div className="ruler flex w-full h-6 bg-gray-100 border-b border-gray-400">
      {markers}
    </div>
  );
});

export default Ruler;