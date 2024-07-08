
/**
 * Represents a scene in a video editor.
 */
export interface Scene {
  /**
   * The unique identifier of the scene.
   */
  id: number;

  /**
   * The name of the scene.
   */
  name: string;

  /**
   * The duration of the scene in seconds.
   */
  duration: number;

  /**
   * The URL of the video associated with the scene.
   */
  url: string;
}
