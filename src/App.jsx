import BrainScene from './components/BrainScene';
import StateSelector from './components/StateSelector';
import InfoPanel from './components/InfoPanel';
import NeurotransmitterBars from './components/NeurotransmitterBars';
import CompareSlider from './components/CompareSlider';
import RegionDetail from './components/RegionDetail';
import GuidedTour from './components/GuidedTour';
import TimelineSlider from './components/TimelineSlider';
import AudioEngine from './components/AudioEngine';
import './styles/index.css';

export default function App() {
  return (
    <div className="app">
      <BrainScene />
      <StateSelector />
      <InfoPanel />
      <RegionDetail />
      <NeurotransmitterBars />
      <CompareSlider />
      <GuidedTour />
      <TimelineSlider />
      <AudioEngine />
      <header className="app-header">
        <h1>Brain State Explorer</h1>
      </header>
    </div>
  );
}
