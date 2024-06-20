import { Scene } from './Scene';

export interface DroppedScene extends Scene {
  leftTrim: number;
  rightTrim: number;
  uniqueId: string; // Ensure unique keys for dropped scenes
}
