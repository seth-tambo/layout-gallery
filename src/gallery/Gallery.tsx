import { Link } from 'react-router';
import { layouts, categories } from '../layouts/registry.ts';

export default function Gallery() {
    return (
        <div className="min-h-dvh bg-[#0a1628] text-white font-mono">
            {/* Header */}
            <header className="border-b border-[#1e3a5f] bg-[#0d1f3c] px-6 py-4">
                <h1 className="text-sm uppercase tracking-[0.3em] text-white">
                    Layout Gallery
                </h1>
                <p className="text-[10px] text-white/50 mt-1 tracking-[0.15em]">
                    A collection of full-viewport layout experiments
                </p>
            </header>

            {/* Grouped layout listing */}
            <main className="p-6 lg:p-10 space-y-10">
                {categories.map((cat) => {
                    const items = layouts.filter((l) => l.category === cat.id);
                    if (items.length === 0) return null;

                    return (
                        <section key={cat.id}>
                            <div className="mb-4">
                                <h2 className="text-xs uppercase tracking-[0.25em] text-white">
                                    {cat.label}
                                </h2>
                                <p className="text-[10px] text-white/50 mt-1 tracking-[0.1em]">
                                    {cat.description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((layout) => (
                                    <Link
                                        key={layout.slug}
                                        to={`/layouts/${layout.slug}`}
                                        className="group block border border-[#1e3a5f] rounded-lg bg-[#0b1a30] hover:border-white/30 hover:bg-[#0f2235] transition-all"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-sm text-white/90 group-hover:text-white transition-colors">
                                                    {layout.name}
                                                </h3>
                                                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] shrink-0 ml-3">
                                                    /{layout.slug}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-white/50 leading-relaxed">
                                                {layout.description}
                                            </p>
                                        </div>
                                        <div className="border-t border-[#152540] px-5 py-2.5">
                                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                                                View Layout &rarr;
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
