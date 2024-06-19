import React from 'react';

interface CursorProps {
  position: number; // Position in seconds
  trackWidth: number; // Width of the track in pixels
  totalDuration: number; // Total duration of all scenes in seconds
}

const Cursor: React.FC<CursorProps> = ({ position, trackWidth, totalDuration }) => {
  const cursorPosition = (position / totalDuration) * trackWidth;

  return (
    <div className="relative">
      <div
        className="absolute bg-red-500 h-full"
        style={{ left: `${cursorPosition}px`, width: '2px' }}
      />
    </div>
  );
};

export default Cursor;