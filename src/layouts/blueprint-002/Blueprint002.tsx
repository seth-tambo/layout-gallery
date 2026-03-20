import { useState } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './blueprint-002.css';

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

const sectionDetails = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    title: `Section ${String(i + 1).padStart(2, '0')}`,
    fields: [
        { label: 'Status', value: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Draft' },
        { label: 'Priority', value: i % 2 === 0 ? 'High' : 'Normal' },
        { label: 'Created', value: `2026-03-${String(10 + i).padStart(2, '0')}` },
        { label: 'Author', value: `User ${String((i % 4) + 1).padStart(2, '0')}` },
        { label: 'Tags', value: ['layout', 'experiment', 'blueprint'].slice(0, (i % 3) + 1).join(', ') },
    ],
    notes: `Extended details for section ${i + 1}. This panel slides over the content area to reveal additional metadata, configuration options, and related information without leaving the current context. The slide-over pattern keeps the user oriented within the three-column structure while providing a fourth layer of depth on demand.`,
    relatedItems: Array.from({ length: 4 }, (_, j) => ({
        id: `${i}-${j}`,
        label: `Related ${String(j + 1).padStart(2, '0')}`,
        type: j % 2 === 0 ? 'Reference' : 'Dependency',
    })),
}));

export default function Blueprint002() {
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const detail = activeSection !== null ? sectionDetails[activeSection] : null;

    return (
        <div className="blueprint-002 flex flex-col h-dvh overflow-hidden bg-[#0a1628] blueprint-grid text-[#c8e8f8]">
            <BackToGallery />

            {/* Header */}
            <header className="shrink-0 border-b border-[#1e3a5f] bg-[#0d1f3c] px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-sm font-mono uppercase tracking-[0.3em] text-[#78bce8]">
                        Layout Gallery
                    </h1>
                    <span className="text-xs font-mono text-[#5ca0d0]">
                        Blueprint 002
                    </span>
                </div>
            </header>

            {/* Mobile controls */}
            <div className="shrink-0 lg:hidden border-b border-[#1e3a5f] bg-[#0b1a30]">
                <div className="px-4 py-3 border-b border-[#1e3555]">
                    <label
                        htmlFor="mobile-nav-002"
                        className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-2"
                    >
                        Navigation
                    </label>
                    <select
                        id="mobile-nav-002"
                        className="w-full bg-[#0d1f3c] border border-[#1e3a5f] rounded px-3 py-2 text-xs font-mono text-[#c8e8f8] focus:outline-none focus:border-[#78bce8]"
                    >
                        {navItems.map((item, i) => (
                            <option key={item} value={item}>
                                {String(i + 1).padStart(2, '0')} — {item}
                            </option>
                        ))}
                    </select>
                </div>

                <details className="group">
                    <summary className="px-4 py-3 text-xs font-mono text-[#8cc0e4] cursor-pointer select-none list-none flex items-center justify-between hover:bg-[#111f38] transition-colors">
                        <span>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#5ca0d0]">
                                Items
                            </span>
                            <span className="text-[#5890b8] ml-2">
                                ({listItems.length})
                            </span>
                        </span>
                        <span className="text-[#5ca0d0] text-sm transition-transform group-open:rotate-90">
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
                                        : 'border-[#1e3555] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-xs font-mono text-[#9cd0f0]">
                                        {item.label}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#5890b8]">
                                        {item.hoursAgo}h ago
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#7cb4d8] leading-relaxed">
                                    {item.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </details>
            </div>

            {/* Main */}
            <main className="flex flex-1 min-h-0">
                {/* Column 1: Navigation */}
                <nav className="hidden lg:block w-56 shrink-0 border-r border-[#1e3a5f] bg-[#0b1a30] overflow-y-auto blueprint-scroll">
                    <div className="p-4">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-4">
                            Navigation
                        </h2>
                        <ul className="space-y-1">
                            {navItems.map((item, i) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className={`block px-3 py-2 text-xs font-mono rounded transition-colors ${
                                            i === 0
                                                ? 'bg-[#1a3555] text-[#c8e8f8]'
                                                : 'text-[#8cc0e4] hover:text-[#c8e8f8] hover:bg-[#111f38]'
                                        }`}
                                    >
                                        <span className="text-[#5ca0d0] mr-2">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Column 2: Item List */}
                <section className="hidden lg:block w-72 shrink-0 border-r border-[#1e3a5f] bg-[#0c1d35] overflow-y-auto blueprint-scroll">
                    <div className="p-4">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-4">
                            Items
                        </h2>
                        <ul className="space-y-2">
                            {listItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-3 rounded border transition-colors cursor-pointer ${
                                        item.id === 0
                                            ? 'border-[#1e4a6f] bg-[#12283f]'
                                            : 'border-[#1e3555] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-xs font-mono text-[#9cd0f0]">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono text-[#5890b8]">
                                            {item.hoursAgo}h ago
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#7cb4d8] leading-relaxed">
                                        {item.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Column 3: Content Area — relative so the slide-over positions against it */}
                <section className="relative flex-1 overflow-hidden">
                    {/* Scrollable content underneath */}
                    <div className="absolute inset-0 overflow-y-auto blueprint-scroll bg-[#0a1628] blueprint-grid">
                        <div className="p-5 lg:p-8">
                            <div className="mb-8">
                                <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-6">
                                    Content
                                </h2>
                                <h3 className="text-lg font-mono text-[#b0dcf4] mb-2">
                                    Item 001
                                </h3>
                                <p className="text-xs font-mono text-[#5ca0d0] mb-6">
                                    Last modified 3 hours ago
                                </p>
                            </div>

                            <div className="space-y-8">
                                {sectionDetails.map((section, i) => (
                                    <div key={i}>
                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5ca0d0] mb-3">
                                            {section.title}
                                        </h4>
                                        <div className="border border-[#1e3555] rounded p-4 bg-[#0b1a30]/50">
                                            <p className="text-xs leading-relaxed text-[#7cb4d8] mb-3">
                                                This is a content block within the main viewing area.
                                                Each section can contain text, components, or any
                                                other elements that need to be displayed. Click the
                                                button below to open the detail panel.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {section.fields.slice(0, 2).map((f) => (
                                                        <span
                                                            key={f.label}
                                                            className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#305878] text-[#7cb4d8]"
                                                        >
                                                            {f.label}: {f.value}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setActiveSection(i)}
                                                    className="text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded border border-[#1e3a5f] text-[#78bce8] hover:bg-[#1a3555] hover:text-[#c8e8f8] hover:border-[#5ca0d0] transition-all cursor-pointer"
                                                >
                                                    Details &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Slide-over panel (layer 4) */}
                    <div
                        className={`slide-over absolute inset-0 z-10 flex flex-col bg-[#0c1d35] border-l border-[#1e3a5f] ${
                            activeSection !== null ? 'slide-over-open' : ''
                        }`}
                    >
                        {detail && (
                            <>
                                {/* Panel header */}
                                <div className="shrink-0 flex items-center justify-between border-b border-[#1e3a5f] bg-[#0d1f3c] px-5 py-3">
                                    <div>
                                        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#78bce8]">
                                            {detail.title}
                                        </h3>
                                        <p className="text-[10px] font-mono text-[#5ca0d0] mt-0.5">
                                            Detail Panel
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveSection(null)}
                                        className="text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded border border-[#1e3a5f] text-[#8cc0e4] hover:bg-[#1a3555] hover:text-[#c8e8f8] hover:border-[#5ca0d0] transition-all cursor-pointer"
                                    >
                                        &larr; Close
                                    </button>
                                </div>

                                {/* Panel content */}
                                <div className="flex-1 overflow-y-auto blueprint-scroll p-5">
                                    {/* Metadata fields */}
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-3">
                                            Metadata
                                        </h4>
                                        <div className="space-y-2">
                                            {detail.fields.map((field) => (
                                                <div
                                                    key={field.label}
                                                    className="flex items-center justify-between py-2 px-3 rounded border border-[#1e3555] bg-[#0b1a30]/50"
                                                >
                                                    <span className="text-[10px] font-mono text-[#5ca0d0] uppercase tracking-[0.15em]">
                                                        {field.label}
                                                    </span>
                                                    <span className="text-xs font-mono text-[#9cd0f0]">
                                                        {field.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-3">
                                            Notes
                                        </h4>
                                        <div className="border border-[#1e3555] rounded p-4 bg-[#0b1a30]/50">
                                            <p className="text-xs leading-relaxed text-[#7cb4d8]">
                                                {detail.notes}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Related items */}
                                    <div>
                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5ca0d0] mb-3">
                                            Related
                                        </h4>
                                        <ul className="space-y-2">
                                            {detail.relatedItems.map((rel) => (
                                                <li
                                                    key={rel.id}
                                                    className="flex items-center justify-between p-3 rounded border border-[#1e3555] bg-[#0b1a30]/50 hover:border-[#1e3a5f] transition-colors cursor-pointer"
                                                >
                                                    <span className="text-xs font-mono text-[#9cd0f0]">
                                                        {rel.label}
                                                    </span>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#305878] text-[#5ca0d0]">
                                                        {rel.type}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="shrink-0 border-t border-[#1e3a5f] bg-[#0d1f3c] px-4 py-2 lg:px-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#5890b8]">
                        3 columns + slide-over &middot; independent scroll &middot; fixed viewport
                    </span>
                    <span className="text-[10px] font-mono text-[#5890b8]">
                        v0.1.0
                    </span>
                </div>
            </footer>
        </div>
    );
}
