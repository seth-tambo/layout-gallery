import { useState, useCallback, useRef, useEffect } from 'react';
import type { MouseEvent, FormEvent } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './canvas-001.css';

interface Panel {
    id: string;
    title: string;
    x: number;
    y: number;
    w: number;
    content: React.ReactNode;
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'ai';
    componentId?: string;
}

const contentTemplates = [
    (label: string) => ({
        title: label,
        w: 320,
        content: (
            <div className="space-y-2">
                {[
                    { label: 'Value A', value: `${Math.floor(Math.random() * 100)}%` },
                    { label: 'Value B', value: `${Math.floor(Math.random() * 500)}ms` },
                    { label: 'Value C', value: `${(Math.random() * 5).toFixed(1)}k/s` },
                ].map((m) => (
                    <div key={m.label} className="flex justify-between py-1.5 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#4a7a9e] uppercase tracking-wider">{m.label}</span>
                        <span className="text-sm font-mono text-[#7cb8e0]">{m.value}</span>
                    </div>
                ))}
            </div>
        ),
    }),
    (label: string) => ({
        title: label,
        w: 300,
        content: (
            <ul className="space-y-1.5">
                {['Alpha', 'Beta', 'Gamma', 'Delta'].map((name, i) => (
                    <li key={name} className="flex items-center gap-2 py-1 px-2 rounded border border-[#152540]">
                        <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${i < 2 ? 'bg-[#2a8a5a]' : 'bg-[#1e3a5f]'}`} />
                        <span className="text-sm font-mono text-[#7eb8da]">{name}</span>
                    </li>
                ))}
            </ul>
        ),
    }),
    (label: string) => ({
        title: label,
        w: 340,
        content: (
            <div className="space-y-1.5">
                {[
                    { key: 'TYPE', val: 'Composite' },
                    { key: 'STATUS', val: 'Active' },
                    { key: 'REGION', val: 'us-west-2' },
                ].map((e) => (
                    <div key={e.key} className="flex justify-between py-1 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#3a6a8e]">{e.key}</span>
                        <span className="text-sm font-mono text-[#7cb8e0]">{e.val}</span>
                    </div>
                ))}
            </div>
        ),
    }),
    (label: string) => ({
        title: label,
        w: 300,
        content: (
            <ul className="space-y-1.5">
                {['Setup environment', 'Run benchmarks', 'Analyze results', 'Write report'].map((task, i) => (
                    <li key={task} className="flex items-center gap-2 py-1 px-2 rounded border border-[#152540]">
                        <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-[#2a8a5a]' : 'bg-[#1e3a5f]'}`} />
                        <span className={`text-sm font-mono ${i === 0 ? 'text-[#4a7a9e] line-through' : 'text-[#7eb8da]'}`}>
                            {task}
                        </span>
                    </li>
                ))}
            </ul>
        ),
    }),
];

const initialPanels: Panel[] = [
    {
        id: 'overview',
        title: 'Project Overview',
        x: 80,
        y: 80,
        w: 380,
        content: (
            <div className="space-y-3">
                <p className="text-sm leading-relaxed text-[#8ab8d8]">
                    An infinite canvas layout. Drag the background to pan. Scroll to zoom.
                    Panels float freely in space.
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {['Active', 'Draft', 'Review', 'Done'].map((s) => (
                        <div key={s} className="px-2 py-1.5 rounded border border-[#1e3a5f] text-center">
                            <span className="text-sm font-mono text-[#5a9ac4]">{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'metrics',
        title: 'Metrics',
        x: 520,
        y: 60,
        w: 320,
        content: (
            <div className="space-y-2">
                {[
                    { label: 'Uptime', value: '99.97%' },
                    { label: 'Latency', value: '42ms' },
                    { label: 'Throughput', value: '1.2k/s' },
                    { label: 'Error Rate', value: '0.03%' },
                    { label: 'Active Users', value: '847' },
                ].map((m) => (
                    <div key={m.label} className="flex justify-between py-1.5 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#4a7a9e] uppercase tracking-wider">{m.label}</span>
                        <span className="text-sm font-mono text-[#7cb8e0]">{m.value}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'notes',
        title: 'Notes',
        x: 120,
        y: 380,
        w: 380,
        content: (
            <div className="space-y-2">
                {[
                    { time: '2m ago', text: 'Deployed v2.4.1 to production' },
                    { time: '18m ago', text: 'Database migration completed successfully' },
                    { time: '1h ago', text: 'Reviewed PR #342 — approved with minor comments' },
                    { time: '3h ago', text: 'Investigated spike in p99 latency, traced to cold cache' },
                ].map((n, i) => (
                    <div key={i} className="py-1.5 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#3a6a8e] mr-2">{n.time}</span>
                        <span className="text-sm text-[#7eb8da]">{n.text}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'tasks',
        title: 'Task Queue',
        x: 560,
        y: 420,
        w: 320,
        content: (
            <ul className="space-y-1.5">
                {[
                    { label: 'Refactor auth middleware', done: true },
                    { label: 'Add rate limiting', done: true },
                    { label: 'Write integration tests', done: false },
                    { label: 'Update API docs', done: false },
                    { label: 'Performance audit', done: false },
                    { label: 'Accessibility review', done: false },
                ].map((t, i) => (
                    <li key={i} className="flex items-center gap-2 py-1 px-2 rounded border border-[#152540]">
                        <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${t.done ? 'bg-[#2a8a5a]' : 'bg-[#1e3a5f]'}`} />
                        <span className={`text-sm font-mono ${t.done ? 'text-[#4a7a9e] line-through' : 'text-[#7eb8da]'}`}>
                            {t.label}
                        </span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        id: 'connections',
        title: 'Services',
        x: -320,
        y: 140,
        w: 320,
        content: (
            <div className="space-y-2">
                {[
                    { name: 'API Gateway', status: 'healthy' },
                    { name: 'Auth Service', status: 'healthy' },
                    { name: 'Worker Pool', status: 'degraded' },
                    { name: 'Cache Layer', status: 'healthy' },
                    { name: 'Event Bus', status: 'healthy' },
                ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between py-1.5 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#7eb8da]">{s.name}</span>
                        <span className={`text-sm font-mono uppercase tracking-wider ${
                            s.status === 'healthy' ? 'text-[#4a9a6a]' : 'text-[#c4944a]'
                        }`}>
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'schema',
        title: 'Data Schema',
        x: -280,
        y: -180,
        w: 340,
        content: (
            <div className="space-y-1">
                <div className="text-sm font-mono text-[#4a7a9e] uppercase tracking-wider mb-2">users</div>
                {['id: uuid', 'email: string', 'name: string', 'role: enum', 'created_at: timestamp', 'last_login: timestamp'].map((f) => (
                    <div key={f} className="text-sm font-mono text-[#6aaad0] pl-3 border-l border-[#1e3a5f]">
                        {f}
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'env',
        title: 'Environment',
        x: 160,
        y: -220,
        w: 320,
        content: (
            <div className="space-y-1.5">
                {[
                    { key: 'NODE_ENV', val: 'production' },
                    { key: 'REGION', val: 'us-east-1' },
                    { key: 'REPLICAS', val: '3' },
                    { key: 'LOG_LEVEL', val: 'info' },
                ].map((e) => (
                    <div key={e.key} className="flex justify-between py-1 px-2 rounded border border-[#152540]">
                        <span className="text-sm font-mono text-[#3a6a8e]">{e.key}</span>
                        <span className="text-sm font-mono text-[#7cb8e0]">{e.val}</span>
                    </div>
                ))}
            </div>
        ),
    },
];

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

let panelCounter = initialPanels.length;

export default function Canvas001() {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
    const [dragging, setDragging] = useState<{ type: 'canvas' } | { type: 'panel'; id: string; offsetX: number; offsetY: number } | null>(null);
    const [panels, setPanels] = useState(initialPanels);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'welcome', text: 'Describe a panel to add to the canvas.', from: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [chatExpanded, setChatExpanded] = useState(true);
    const lastMouse = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        // Only start canvas drag from the background (not from panels)
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-dots')) {
            setDragging({ type: 'canvas' });
            lastMouse.current = { x: e.clientX, y: e.clientY };
            e.preventDefault();
        }
    }, []);

    const handlePanelMouseDown = useCallback((e: MouseEvent, panelId: string) => {
        const panel = panels.find((p) => p.id === panelId);
        if (!panel) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
        const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;

        setDragging({
            type: 'panel',
            id: panelId,
            offsetX: canvasX - panel.x,
            offsetY: canvasY - panel.y,
        });

        // Bring panel to front
        setPanels((prev) => {
            const idx = prev.findIndex((p) => p.id === panelId);
            if (idx === -1 || idx === prev.length - 1) return prev;
            const copy = [...prev];
            const [moved] = copy.splice(idx, 1);
            copy.push(moved);
            return copy;
        });

        e.preventDefault();
        e.stopPropagation();
    }, [panels, camera]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging) return;

        if (dragging.type === 'canvas') {
            const dx = e.clientX - lastMouse.current.x;
            const dy = e.clientY - lastMouse.current.y;
            lastMouse.current = { x: e.clientX, y: e.clientY };
            setCamera((c) => ({ ...c, x: c.x + dx / c.zoom, y: c.y + dy / c.zoom }));
        } else {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
            const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;

            setPanels((prev) =>
                prev.map((p) =>
                    p.id === dragging.id
                        ? { ...p, x: canvasX - dragging.offsetX, y: canvasY - dragging.offsetY }
                        : p
                )
            );
        }
    }, [dragging, camera]);

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setCamera((c) => ({
            ...c,
            zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, c.zoom + delta * c.zoom)),
        }));
    }, []);

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
            const panelId = `gen-panel-${panelCounter++}`;
            const template = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
            const label = text.length > 24 ? text.slice(0, 24) + '…' : text;
            const generated = template(label);

            const angle = Math.random() * Math.PI * 2;
            const radius = 150 + Math.random() * 250;
            const newPanel: Panel = {
                id: panelId,
                title: generated.title,
                x: Math.round(Math.cos(angle) * radius),
                y: Math.round(Math.sin(angle) * radius),
                w: generated.w,
                content: generated.content,
            };

            setPanels((prev) => [...prev, newPanel]);
            setMessages((prev) => [
                ...prev,
                { id: `ai-${Date.now()}`, text: `Added "${label}" panel to the canvas.`, from: 'ai', componentId: panelId },
            ]);
        }, 300);
    }, [input]);

    return (
        <div className="canvas-001 h-dvh overflow-hidden bg-[#0a1020] select-none">
            <BackToGallery />

            {/* Canvas viewport */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* Transformed canvas layer */}
                <div
                    className="canvas-dots w-full h-full"
                    style={{
                        transform: `translate(50%, 50%) scale(${camera.zoom}) translate(${camera.x}px, ${camera.y}px)`,
                        transformOrigin: '0 0',
                    }}
                >
                    {/* Panels */}
                    {panels.map((panel, i) => (
                        <div
                            key={panel.id}
                            className="absolute rounded-lg border border-[#1e3a5f] bg-[#0b1a30]/95 backdrop-blur-sm shadow-2xl shadow-black/40"
                            style={{
                                left: panel.x,
                                top: panel.y,
                                width: panel.w,
                                zIndex: i + 1,
                            }}
                        >
                            {/* Panel title bar */}
                            <div
                                className="flex items-center justify-between px-3 py-2 border-b border-[#1e3a5f] bg-[#0d1f3c]/80 rounded-t-lg cursor-grab active:cursor-grabbing"
                                onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
                            >
                                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-[#4a90c4]">
                                    {panel.title}
                                </h3>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
                                </div>
                            </div>

                            {/* Panel body */}
                            <div className="p-3">
                                {panel.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tambo Chat — fixed floating bottom-left */}
            <div
                className="fixed left-4 z-50 flex flex-col rounded-lg border border-[#1e3a5f] bg-[#0b1a30]/95 backdrop-blur-md shadow-2xl shadow-black/60 transition-all duration-300 overflow-hidden font-mono"
                style={{
                    bottom: 56,
                    width: 320,
                    height: chatExpanded ? 380 : 40,
                }}
            >
                {/* Header */}
                <div
                    className="shrink-0 flex items-center justify-between px-3 cursor-pointer rounded-t-lg bg-[#0d1f3c]/80 border-b border-[#1e3a5f]"
                    style={{ height: 40 }}
                    onClick={() => setChatExpanded((v) => !v)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4a90c4]">Tambo</span>
                        {!chatExpanded && (
                            <span className="text-[10px] text-[#3a6a8e]">Canvas Panel Generator</span>
                        )}
                    </div>
                    <span
                        className="text-[#3a6a8e] text-xs transition-transform duration-300"
                        style={{ transform: chatExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        &#9650;
                    </span>
                </div>

                {chatExpanded && (
                    <>
                        <div className="px-3 py-1.5 border-b border-[#152540]">
                            <span className="text-[10px] text-[#3a6a8e]">Canvas Panel Generator</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 chat-scroll">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded px-2.5 py-1.5 text-xs leading-relaxed ${
                                        msg.from === 'user'
                                            ? 'bg-[#1a3555] text-[#7eb8da] ml-6'
                                            : 'bg-[#0a1020] text-[#5a9ac4] mr-6 border border-[#152540]'
                                    }`}
                                >
                                    {msg.text}
                                    {msg.componentId && (
                                        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-[#1e3a5f]">
                                            <div className="w-3 h-3 rounded border border-[#4a90c4] bg-[#1a3555]" />
                                            <span className="text-[10px] text-[#3a6a8e]">Panel added to canvas</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="shrink-0 p-2.5 border-t border-[#152540]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Describe a panel..."
                                    className="flex-1 bg-[#0a1020] border border-[#1e3a5f] rounded px-2.5 py-1.5 text-xs text-[#7eb8da] placeholder-[#2a5a8a] focus:outline-none focus:border-[#4a90c4]"
                                />
                                <button
                                    type="submit"
                                    className="px-2.5 py-1.5 rounded bg-[#1a3555] hover:bg-[#1e4a6f] text-[10px] uppercase tracking-wider text-[#4a90c4] border border-[#1e3a5f] transition-colors cursor-pointer"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* HUD: zoom indicator — moved to bottom-right to avoid chat overlap */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 backdrop-blur-sm">
                <button
                    onClick={() => setCamera((c) => ({ ...c, zoom: Math.max(MIN_ZOOM, c.zoom - 0.1) }))}
                    className="text-sm font-mono text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                >
                    &minus;
                </button>
                <span className="text-sm font-mono text-white/50 w-12 text-center">
                    {Math.round(camera.zoom * 100)}%
                </span>
                <button
                    onClick={() => setCamera((c) => ({ ...c, zoom: Math.min(MAX_ZOOM, c.zoom + 0.1) }))}
                    className="text-sm font-mono text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    );
}
