import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { observer } from 'mobx-react-lite';
import Preview from './Preview';
import Cursor from './Cursor';
import SceneItem from './SceneItem';
import Ruler from './Ruler';
import videoEditorStore from './stores/VideoEditorStore';

const Track: React.FC = observer(() => {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'scene',
    drop: (item: { id: number }) => {
      const scene = videoEditorStore.scenes.find(scene => scene.id === item.id);
      if (scene) {
        videoEditorStore.addSceneToTrack(scene);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: () => videoEditorStore.mode === 'dnd', // Enable drop only in DnD mode
  });

  useEffect(() => {
    if (videoEditorStore.isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const totalDuration = videoEditorStore.totalDuration;

  return (
    <div className="track-container p-4 border">
      <div className="mode-controls flex mb-4">
        <button
          className={`mode-button p-2 border ${videoEditorStore.mode === 'dnd' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => (videoEditorStore.mode = 'dnd')}
        >
          Drag and Drop Mode
        </button>
        <button
          className={`mode-button p-2 border ml-2 ${videoEditorStore.mode === 'trim' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => (videoEditorStore.mode = 'trim')}
        >
          Trim Mode
        </button>
      </div>
      <Ruler />
      <div
        className={`track ${isOver ? 'bg-gray-200' : ''} p-4 border`}
        ref={drop}
        onClick={(e) => {
          const boundingRect = trackRef.current?.getBoundingClientRect();
          if (boundingRect) {
            const clickX = e.clientX - boundingRect.left;
            const newTime = (clickX / boundingRect.width) * totalDuration;
            videoEditorStore.handleTrackClick(newTime);
            if (videoRef.current) {
              videoRef.current.currentTime = newTime;
            }
          }
        }}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <div className="zoom-controls mb-4">
          <button onClick={() => videoEditorStore.handleZoomOut()} className="zoom-button p-2 border mr-2">
            -
          </button>
          <button onClick={() => videoEditorStore.handleZoomIn()} className="zoom-button p-2 border">
            +
          </button>
        </div>
        <div className="track-content p-4 border" ref={trackRef} style={{ width: '100%' }}>
          {videoEditorStore.droppedScenes.map((scene, index) => (
            <SceneItem
              key={scene.uniqueId}
              scene={scene}
              index={index}
              moveScene={videoEditorStore.moveScene}
              zoomLevel={videoEditorStore.zoomLevel}
              onTrim={videoEditorStore.handleTrim}
              mode={videoEditorStore.mode}
            />
          ))}
        </div>
      </div>
      <button onClick={() => videoEditorStore.handlePlayPause()} className="play-button mt-4 p-2 border">
        {videoEditorStore.isPlaying ? 'Pause' : 'Play'}
      </button>
      <Cursor/>
      <Preview  />
    </div>
  );
});

export default Track;