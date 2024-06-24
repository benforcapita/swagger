import { makeAutoObservable } from 'mobx';
import { Scene } from '../../interfaces/Scene';
import { DroppedScene } from '../../interfaces/DroppedScene';

class VideoEditorStore {
  scenes: Scene[] = [
    { id: 1, name: 'Scene 1', duration: 3, url: '/videos/1.mp4' },
    { id: 2, name: 'Scene 2', duration: 4.2, url: '/videos/2.mp4' },
    { id: 3, name: 'Scene 3', duration: 5.5, url: '/videos/3.mp4' },
  ];

  droppedScenes: DroppedScene[] = [];
  isPlaying: boolean = false;
  currentSceneIndex: number = 0;
  currentTime: number = 0; // in seconds
  zoomLevel: number = 1;
  mode: 'dnd' | 'trim' = 'dnd'; // Mode selection

  constructor() {
    makeAutoObservable(this);
  }

  addSceneToTrack(scene: Scene) {
    const uniqueId = `${scene.id}-${Date.now()}`;
    this.droppedScenes.push({ ...scene, uniqueId, leftTrim: 0, rightTrim: scene.duration });
  }

  moveScene(dragIndex: number, hoverIndex: number) {
    const dragScene = this.droppedScenes[dragIndex];
    this.droppedScenes.splice(dragIndex, 1);
    this.droppedScenes.splice(hoverIndex, 0, dragScene);
  }

  handleTrim(index: number, newLeftTrim: number, newRightTrim: number) {
    this.droppedScenes[index].leftTrim = newLeftTrim;
    this.droppedScenes[index].rightTrim = newRightTrim;
  }

  handlePlayPause() {
    this.isPlaying = !this.isPlaying;
  }

  handleTimeUpdate(time: number) {
    this.currentTime = time;
  }

  handleSceneEnd() {
    this.isPlaying = false;
    this.currentSceneIndex = 0;
    this.currentTime = 0;
  }

  setPlaying(playing: boolean) {
    this.isPlaying = playing;
  }

  setCurrentSceneIndex(index: number) {
    this.currentSceneIndex = index;
  }

  setDroppedScenes(scenes: DroppedScene[]) {
    this.droppedScenes = scenes;
  }


  handleZoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
  }

  handleZoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
  }

  handleTrackClick(newTime: number) {
    this.currentTime = newTime;
    let accumulatedDuration = 0;
    for (let i = 0; i < this.droppedScenes.length; i++) {
      accumulatedDuration += this.droppedScenes[i].rightTrim - this.droppedScenes[i].leftTrim;
      if (newTime <= accumulatedDuration) {
        this.currentSceneIndex = i;
        break;
      }
    }
  }

  get totalDuration() {
    return this.droppedScenes.reduce((acc, scene) => acc + (scene.rightTrim - scene.leftTrim), 0);
  }

  get trackWidth() {
    return 1000; // Assuming track width is 1000 pixels, you can adjust this value accordingly
  }
}

const videoEditorStore = new VideoEditorStore();
export default videoEditorStore;



