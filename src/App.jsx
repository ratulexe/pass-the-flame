import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DiyaGradients from './components/DiyaGradients';
import ErrorBoundary from './components/ErrorBoundary';
import FireworksCanvas from './components/FireworksCanvas';
import Footer from './components/Footer';
import SkyLife from './components/SkyLife';
import SoundToggle from './components/SoundToggle';
import StarrySky from './components/StarrySky';
import Toast from './components/Toast';
import Toran from './components/Toran';

const CreatePage = lazy(() => import('./pages/CreatePage'));
const ReceivePage = lazy(() => import('./pages/ReceivePage'));
const SkyPage = lazy(() => import('./pages/SkyPage'));

export default function App() {
  return (
    <>
      <DiyaGradients />
      <StarrySky />
      <SkyLife />
      <Toran />
      <FireworksCanvas />
      <div className="relative z-[2] mx-auto flex max-w-[480px] flex-col gap-[22px] px-[18px] pt-[66px] pb-14">
        <header className="dimmable flex items-center justify-between gap-3">
          <Link to="/" className="font-display text-[1.1rem] tracking-[0.02em] text-flame">
            Pass the Flame
          </Link>
          <SoundToggle />
        </header>
        <main>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<CreatePage />} />
                <Route path="/g/:id" element={<ReceivePage />} />
                <Route path="/sky" element={<SkyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}
