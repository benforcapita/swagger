import SceneList from './components/SceneList';
import Track from './components/Track';
import Ruler from './components/Ruler';
import Preview from './components/Preview';
import Cursor from './components/Cursor';

const App = () => {
  return (
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
  );
};

export default App;