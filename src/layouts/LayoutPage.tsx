import { Suspense } from 'react';
import { useParams, Link } from 'react-router';
import { layouts } from './registry.ts';

export default function LayoutPage() {
    const { slug } = useParams<{ slug: string }>();
    const entry = layouts.find((l) => l.slug === slug);

    if (!entry) {
        return (
            <div className="flex flex-col items-center justify-center h-dvh bg-[#0a1628] text-white font-mono">
                <h1 className="text-lg mb-4 text-white">Layout not found</h1>
                <p className="text-xs text-white/50 mb-6">
                    No layout matches "{slug}"
                </p>
                <Link
                    to="/"
                    className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                >
                    &larr; Back to Gallery
                </Link>
            </div>
        );
    }

    const Component = entry.component;

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-dvh bg-[#0a1628]">
                    <span className="text-xs font-mono text-white/50 animate-pulse">
                        Loading…
                    </span>
                </div>
            }
        >
            <Component />
        </Suspense>
    );
}
