import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
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

interface ListItem {
    id: string;
    label: string;
    hoursAgo: number;
    description: string;
    isGenerated?: boolean;
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'ai';
    componentId?: string;
}

const seedItems: ListItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: `seed-${i}`,
    label: `Item ${String(i + 1).padStart(3, '0')}`,
    hoursAgo: ((i * 7 + 3) % 12) + 1,
    description: 'A brief description of this item and what it contains.',
}));

let nextItemId = 0;

export default function Blueprint001() {
    const [listItems, setListItems] = useState<ListItem[]>(seedItems);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'welcome', text: 'Describe an item to add to the list.', from: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [chatExpanded, setChatExpanded] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback((e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        setMessages((prev) => [
            ...prev,
            { id: `user-${Date.now()}`, text, from: 'user' },
        ]);
        setInput('');

        setTimeout(() => {
            const itemId = `gen-${nextItemId++}`;
            const newItem: ListItem = {
                id: itemId,
                label: text.length > 28 ? text.slice(0, 28) + '…' : text,
                hoursAgo: 0,
                description: `Generated from: "${text}"`,
                isGenerated: true,
            };

            setListItems((prev) => [newItem, ...prev]);
            setMessages((prev) => [
                ...prev,
                { id: `ai-${Date.now()}`, text: `Added "${newItem.label}" to the list.`, from: 'ai', componentId: itemId },
            ]);
        }, 300);
    }, [input]);

    const renderMiniItem = (msg: ChatMessage) => {
        if (!msg.componentId) return null;
        const item = listItems.find((it) => it.id === msg.componentId);
        if (!item) return null;
        return (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#1e3a5f]">
                <div className="w-1.5 h-4 rounded-sm bg-[#4a90c4]" />
                <span className="text-[10px] font-mono text-[#5a9ac4] truncate">{item.label}</span>
            </div>
        );
    };

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
                                    item.isGenerated
                                        ? 'border-[#1e4a6f] bg-[#0f2a3f]'
                                        : item.id === 'seed-0'
                                            ? 'border-[#1e4a6f] bg-[#12283f]'
                                            : 'border-[#152540] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-xs font-mono text-[#5a9ac4]">
                                        {item.label}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#2a4a6a]">
                                        {item.hoursAgo === 0 ? 'just now' : `${item.hoursAgo}h ago`}
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
                                        item.isGenerated
                                            ? 'border-[#1e4a6f] bg-[#0f2a3f]'
                                            : item.id === 'seed-0'
                                                ? 'border-[#1e4a6f] bg-[#12283f]'
                                                : 'border-[#152540] bg-transparent hover:border-[#1e3a5f] hover:bg-[#0f2235]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-xs font-mono text-[#5a9ac4]">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono text-[#2a4a6a]">
                                            {item.hoursAgo === 0 ? 'just now' : `${item.hoursAgo}h ago`}
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

            {/* Tambo Chat — collapsible bottom bar */}
            <div
                className="shrink-0 border-t border-[#1e3a5f] bg-[#0d1f3c] flex flex-col transition-all duration-300 overflow-hidden"
                style={{ height: chatExpanded ? 280 : 48 }}
            >
                {/* Chat header — click to toggle */}
                <div
                    className="shrink-0 flex items-center justify-between px-4 cursor-pointer h-12"
                    onClick={() => setChatExpanded((v) => !v)}
                >
                    <div className="flex items-center gap-3">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#4a90c4]">
                            Tambo
                        </h3>
                        <span className="text-[10px] font-mono text-[#2a5a8a]">
                            Describe an item to add to the list
                        </span>
                    </div>
                    <span
                        className="text-[#2a5a8a] text-xs transition-transform duration-300"
                        style={{ transform: chatExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        &#9650;
                    </span>
                </div>

                {/* Chat body */}
                {chatExpanded && (
                    <>
                        <div className="border-t border-[#152540]" />

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 chat-scroll">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded px-3 py-2 text-xs font-mono leading-relaxed ${
                                        msg.from === 'user'
                                            ? 'bg-[#1a3555] text-[#7eb8da] ml-8'
                                            : 'bg-[#0b1a30] text-[#5a9ac4] mr-8 border border-[#152540]'
                                    }`}
                                >
                                    {msg.text}
                                    {renderMiniItem(msg)}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="shrink-0 p-3 border-t border-[#152540]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Describe a list item..."
                                    className="flex-1 bg-[#0b1a30] border border-[#1e3a5f] rounded px-3 py-1.5 text-xs font-mono text-[#7eb8da] placeholder-[#2a5a8a] focus:outline-none focus:border-[#4a90c4]"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 rounded bg-[#1a3555] hover:bg-[#1e4a6f] text-[10px] font-mono uppercase tracking-wider text-[#4a90c4] border border-[#1e3a5f] transition-colors cursor-pointer"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
