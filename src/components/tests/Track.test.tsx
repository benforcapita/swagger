// src/components/Track.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'mobx-react';
import Track from '../Track';
import videoEditorStore from '../stores/VideoEditorStore';

// Mock the MobX store
jest.mock('./stores/VideoEditorStore', () => ({
  scenes: [{ id: 1, name: 'Scene 1' }, { id: 2, name: 'Scene 2' }],
  droppedScenes: [],
  mode: 'dnd',
  isPlaying: false,
  totalDuration: 100,
  addSceneToTrack: jest.fn(),
  handleTrackClick: jest.fn(),
  handleZoomIn: jest.fn(),
  handleZoomOut: jest.fn(),
  handlePlayPause: jest.fn(),
  moveScene: jest.fn(),
  handleTrim: jest.fn(),
  zoomLevel: 1,
}));

describe('Track Component', () => {
  beforeEach(() => {
    render(
      <Provider videoEditorStore={videoEditorStore}>
        <Track />
      </Provider>
    );
  });

  it('allows switching between modes', () => {
    const dndButton = screen.getByText(/drag and drop mode/i);
    const trimButton = screen.getByText(/trim mode/i);

    fireEvent.click(trimButton);
    expect(videoEditorStore.mode).toBe('trim');

    fireEvent.click(dndButton);
    expect(videoEditorStore.mode).toBe('dnd');
  });

  it('allows zooming in and out', () => {
    const zoomInButton = screen.getByText('+');
    const zoomOutButton = screen.getByText('-');

    fireEvent.click(zoomInButton);
    expect(videoEditorStore.handleZoomIn).toHaveBeenCalled();

    fireEvent.click(zoomOutButton);
    expect(videoEditorStore.handleZoomOut).toHaveBeenCalled();
  });

  it('handles play and pause', () => {
    const playPauseButton = screen.getByText(/play/i);

    fireEvent.click(playPauseButton);
    expect(videoEditorStore.handlePlayPause).toHaveBeenCalled();
  });

  it('handles track clicks', () => {
    const trackElement = screen.getByTestId('track');

    fireEvent.click(trackElement, { clientX: 50 });
    expect(videoEditorStore.handleTrackClick).toHaveBeenCalled();
  });

  // Add more tests as needed
});