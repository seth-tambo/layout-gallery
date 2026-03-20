import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './blueprint-001.css';

const navItems = [
    'Dashboard',
    'Projects',
    'Components',
    'Templates',
    'Typography',
    'Color System',
    'Spacing',
    'Grid Layouts',
    'Flex Layouts',
    'Responsive',
    'Animations',
    'Forms',
    'Data Tables',
    'Modals',
    'Navigation',
    'Cards',
    'Lists',
    'Media',
    'Icons',
    'Settings',
];

const listItems = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    label: `Item ${String(i + 1).padStart(3, '0')}`,
    hoursAgo: ((i * 7 + 3) % 12) + 1,
    description: 'A brief description of this item and what it contains.',
}));

export default function Blueprint001() {
    return (
        <div className="blueprint-001 flex flex-col h-dvh overflow-hidden bg-[#0a1628] blueprint-grid text-[#7eb8da]">
            <BackToGallery />

            {/* Header */}
            <header className="shrink-0 border-b border-[#1e3a5f] bg-[#0d1f3c] px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-sm font-mono uppercase tracking-[0.3em] text-[#4a90c4]">
                        Layout Gallery
                    </h1>
                    <span className="text-xs font-mono text-[#2a5a8a]">
                        Blueprint 001
                    </span>
                </div>
            </header>

            {/* Mobile controls: select for nav, details for items */}
            <div className="shrink-0 lg:hidden border-b border-[#1e3a5f] bg-[#0b1a30]">
                {/* Navigation select */}
                <div className="px-4 py-3 border-b border-[#152540]">
                    <label
                        htmlFor="mobile-nav"
                        className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[#2a5a8a] mb-2"
                    >
                        Navigation
                    </label>
                    <select
                        id="mobile-nav"
                        className="w-full bg-[#0d1f3c] border border-[#1e3a5f] rounded px-3 py-2 text-xs font-mono text-[#7eb8da] focus:outline-none focus:border-[#4a90c4]"
                    >
                        {navItems.map((item, i) => (
                            <option key={item} value={item}>
                                {String(i + 1).padStart(2, '0')} — {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Items list via details/summary */}
                <details className="group">
                    <summary className="px-4 py-3 text-xs font-mono text-[#4a7a9e] cursor-pointer select-none list-none flex items-center justify-between hover:bg-[#111f38] transition-colors">
                        <span>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#2a5a8a]">
                                Items
                            </span>
                            <span className="text-[#2a4a6a] ml-2">
                                ({listItems.length})
                            </span>
                        </span>
                        <span className="text-[#2a5a8a] text-sm transition-transform group-open:rotate-90">
                            &#9656;
                        </span>
                    </summary>
                    <ul className="max-h-64 overflow-y-auto blueprint-scroll px-4 pb-3 space-y-2">
                        {listItems.map((item) => (
                            <li
                                key={item.id}
                                className={`p-3 rounded border transition-colors cursor-pointer ${
                                    item.id === 0
                                        ? 'border-[#1e4a6f] bg-[#12283f]'
                                        : 'border-[#152540] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-xs font-mono text-[#5a9ac4]">
                                        {item.label}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#2a4a6a]">
                                        {item.hoursAgo}h ago
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#3a6a8e] leading-relaxed">
                                    {item.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </details>
            </div>

            {/* Main — three columns on desktop, content only on mobile */}
            <main className="flex flex-1 min-h-0">
                {/* Column 1: Navigation (desktop only) */}
                <nav className="hidden lg:block w-56 shrink-0 border-r border-[#1e3a5f] bg-[#0b1a30] overflow-y-auto blueprint-scroll">
                    <div className="p-4">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2a5a8a] mb-4">
                            Navigation
                        </h2>
                        <ul className="space-y-1">
                            {navItems.map((item, i) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className={`block px-3 py-2 text-xs font-mono rounded transition-colors ${
                                            i === 0
                                                ? 'bg-[#1a3555] text-[#7eb8da]'
                                                : 'text-[#4a7a9e] hover:text-[#7eb8da] hover:bg-[#111f38]'
                                        }`}
                                    >
                                        <span className="text-[#2a5a8a] mr-2">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Column 2: Item List (desktop only) */}
                <section className="hidden lg:block w-72 shrink-0 border-r border-[#1e3a5f] bg-[#0c1d35] overflow-y-auto blueprint-scroll">
                    <div className="p-4">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2a5a8a] mb-4">
                            Items
                        </h2>
                        <ul className="space-y-2">
                            {listItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-3 rounded border transition-colors cursor-pointer ${
                                        item.id === 0
                                            ? 'border-[#1e4a6f] bg-[#12283f]'
                                            : 'border-[#152540] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-xs font-mono text-[#5a9ac4]">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono text-[#2a4a6a]">
                                            {item.hoursAgo}h ago
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#3a6a8e] leading-relaxed">
                                        {item.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Column 3: Content Area (always visible) */}
                <section className="flex-1 overflow-y-auto blueprint-scroll bg-[#0a1628] blueprint-grid">
                    <div className="p-5 lg:p-8">
                        <div className="mb-8">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2a5a8a] mb-6">
                                Content
                            </h2>
                            <h3 className="text-lg font-mono text-[#6aaad0] mb-2">
                                Item 001
                            </h3>
                            <p className="text-xs font-mono text-[#2a5a8a] mb-6">
                                Last modified 3 hours ago
                            </p>
                        </div>

                        <div className="space-y-8">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div key={i}>
                                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2a5a8a] mb-3">
                                        Section {String(i + 1).padStart(2, '0')}
                                    </h4>
                                    <div className="border border-[#152540] rounded p-4 bg-[#0b1a30]/50">
                                        <p className="text-xs leading-relaxed text-[#3a6a8e] mb-3">
                                            This is a content block within the main viewing area.
                                            Each section can contain text, components, or any
                                            other elements that need to be displayed. The content
                                            scrolls independently from the navigation and item
                                            list columns.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {Array.from({ length: 3 }, (_, j) => (
                                                <div
                                                    key={j}
                                                    className="border border-dashed border-[#1a3050] rounded p-3 text-center"
                                                >
                                                    <span className="text-[10px] font-mono text-[#2a4a6a]">
                                                        {`${i + 1}.${j + 1}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="shrink-0 border-t border-[#1e3a5f] bg-[#0d1f3c] px-4 py-2 lg:px-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#2a4a6a]">
                        3 columns &middot; independent scroll &middot; fixed viewport
                    </span>
                    <span className="text-[10px] font-mono text-[#2a4a6a]">
                        v0.1.0
                    </span>
                </div>
            </footer>
        </div>
    );
}
