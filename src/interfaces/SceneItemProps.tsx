import { DroppedScene } from "./DroppedScene";

export interface SceneItemProps {
  scene: DroppedScene;
  index: number;
  moveScene: (dragIndex: number, hoverIndex: number) => void;
  zoomLevel: number;
  onTrim: (index: number, newDuration: number,newRightTrim: number) => void;
  mode: 'dnd' | 'trim'; // Add mode prop
}