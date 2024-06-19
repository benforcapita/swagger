import { Scene } from './Scene';

export interface DroppedScene extends Scene {
  uniqueId: string; // Ensure unique keys for dropped scenes
}
