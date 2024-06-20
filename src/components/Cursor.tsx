
import React from 'react';

/**
 * Represents a cursor component that indicates the current position on a track.
 */
interface CursorProps {
  /**
   * The position of the cursor in seconds.
   */
  position: number;
  
  /**
   * The width of the track in pixels.
   */
  trackWidth: number;
  
  /**
   * The total duration of all scenes in seconds.
   */
  totalDuration: number;
}

/**
 * Renders a cursor component based on the provided position, track width, and total duration.
 * @param position - The position of the cursor in seconds.
 * @param trackWidth - The width of the track in pixels.
 * @param totalDuration - The total duration of all scenes in seconds.
 * @returns The rendered cursor component.
 */
const Cursor: React.FC<CursorProps> = ({ position, trackWidth, totalDuration }) => {
  const cursorPosition = (position / totalDuration) * trackWidth;

  return (
    <div className="relative">
      <div
        className="absolute cursor-marker h-full bg-red-500"
        style={{ left: `${cursorPosition}px`, width: '2px' }}
      />
    </div>
  );
};

export default Cursor;