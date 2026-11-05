import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="dimmable mt-1.5 flex flex-col items-center gap-1 text-center text-[0.8rem] text-muted">
      <Link to="/sky" className="link-btn self-center text-[0.95rem]">
        See every diya lit, live
      </Link>
      <p>Once a diya is lit, tap the sky for more fireworks.</p>
      <p>Built with Firebase &amp; Gemini. This site is protected by reCAPTCHA.</p>
    </footer>
  );
}
