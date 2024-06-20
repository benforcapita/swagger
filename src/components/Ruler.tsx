/**
 * Renders a ruler component with markers indicating time intervals.
 * @param totalDuration - The total duration of the ruler in seconds.
 * @param zoomLevel - The zoom level of the ruler, affecting the spacing between markers.
 * @returns The rendered ruler component.
 */
import React from 'react';

const Ruler: React.FC<{ totalDuration: number; zoomLevel: number }> = ({ totalDuration, zoomLevel }) => {
  const markers = [];
  const markerWidth = 50 * zoomLevel; // Adjust marker spacing based on zoom level

  for (let i = 0; i <= totalDuration; i++) {
    markers.push(
      <div
        key={i}
        className="flex flex-grow border-r border-gray-300 text-xs text-center items-center justify-center"
        style={{ width: `${markerWidth}px` }}
      >
        <div >
          {i}s
        </div>
      </div>
    );
  }

  return (
    <div className="ruler flex w-full h-6 bg-gray-100 border-b border-gray-400">
      {markers}
    </div>
  );
};

export default Ruler;