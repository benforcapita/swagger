import React from 'react';
import SceneList from './components/SceneList';
import Track from './components/Track';
import Ruler from './components/Ruler';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="sidebar">
          <SceneList />
        </div>
        <div className="main">
          <Ruler />
          <Track />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;