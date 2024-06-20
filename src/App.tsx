import React from 'react';
import SceneList from './components/SceneList';
import Track from './components/Track';
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
          <Track />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;