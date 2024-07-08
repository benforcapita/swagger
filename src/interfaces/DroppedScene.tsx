import { Scene } from './Scene';

/**
 * Represents a dropped scene in the video editor.
 */
export interface DroppedScene extends Scene {
  leftTrim: number;
  rightTrim: number;
  uniqueId: string; // Ensure unique keys for dropped scenes
}
