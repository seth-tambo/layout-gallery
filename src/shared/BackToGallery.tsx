import { Link } from 'react-router';

export function BackToGallery({ position = 'top-right' }: { position?: 'top-right' | 'top-left' }) {
    const posClass = position === 'top-left' ? 'top-4 left-4' : 'top-4 right-4';
    return (
        <Link
            to="/"
            className={`fixed ${posClass} z-50 px-3 py-1.5 rounded text-sm font-mono uppercase tracking-[0.2em] bg-black/40 text-white/50 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all`}
        >
            &larr; Gallery
        </Link>
    );
}
