import React from 'react';
import SceneList from './components/SceneList';
import Track from './components/Track';
import Ruler from './components/Ruler';
import Preview from './components/Preview';
import Cursor from './components/Cursor';
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
          <Preview />
          <Ruler />
          <Track />
          <Cursor />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;