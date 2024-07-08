import { DroppedScene } from "./DroppedScene";

/**
 * Represents the props for a scene item component.
 */
export interface SceneItemProps {
  /**
   * The scene object.
   */
  scene: DroppedScene;

  /**
   * The index of the scene item.
   */
  index: number;

  /**
   * A function to move the scene item.
   * @param dragIndex - The index of the dragged scene item.
   * @param hoverIndex - The index of the hovered scene item.
   */
  moveScene: (dragIndex: number, hoverIndex: number) => void;

  /**
   * The zoom level of the scene item.
   */
  zoomLevel: number;

  /**
   * A function to trim the scene item.
   * @param index - The index of the scene item.
   * @param newDuration - The new duration of the scene item.
   * @param newRightTrim - The new right trim of the scene item.
   */
  onTrim: (index: number, newDuration: number, newRightTrim: number) => void;

  /**
   * The mode of the scene item.
   */
  mode: 'dnd' | 'trim'; // Add mode prop
}