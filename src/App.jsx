import { Navigate, Route, Routes } from 'react-router-dom';
import DiyaGradients from './components/DiyaGradients';
import FireworksCanvas from './components/FireworksCanvas';
import Footer from './components/Footer';
import SoundToggle from './components/SoundToggle';
import StarrySky from './components/StarrySky';
import Toast from './components/Toast';
import Toran from './components/Toran';
import CreatePage from './pages/CreatePage';
import ReceivePage from './pages/ReceivePage';

export default function App() {
  return (
    <>
      <DiyaGradients />
      <StarrySky />
      <Toran />
      <FireworksCanvas />
      <div className="relative z-[2] mx-auto flex max-w-[480px] flex-col gap-[22px] px-[18px] pt-[66px] pb-14">
        <header className="dimmable flex items-center justify-between gap-3">
          <span className="font-display text-[1.1rem] tracking-[0.02em] text-flame">
            Pass the Flame
          </span>
          <SoundToggle />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CreatePage />} />
            <Route path="/g/:id" element={<ReceivePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}
