import { useState, useCallback, useRef } from 'react';
import type { MouseEvent, FormEvent } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import { PianoRoll } from './PianoRoll.tsx';
import './canvas-002.css';

const PAD_COLORS = [
    { bg: '#6d28d9', glow: '#a78bfa', label: 'Kick' },
    { bg: '#dc2626', glow: '#f87171', label: 'Snare' },
    { bg: '#d97706', glow: '#fbbf24', label: 'Hi-Hat' },
    { bg: '#059669', glow: '#34d399', label: 'Clap' },
    { bg: '#2563eb', glow: '#60a5fa', label: 'Tom' },
    { bg: '#db2777', glow: '#f472b6', label: 'Rim' },
    { bg: '#7c3aed', glow: '#a78bfa', label: 'Perc' },
    { bg: '#ea580c', glow: '#fb923c', label: 'FX' },
    { bg: '#0891b2', glow: '#22d3ee', label: 'Sub' },
    { bg: '#4f46e5', glow: '#818cf8', label: 'Open HH' },
    { bg: '#be123c', glow: '#fb7185', label: 'Crash' },
    { bg: '#15803d', glow: '#4ade80', label: 'Ride' },
];

interface BeatPad {
    id: string;
    x: number;
    y: number;
    color: typeof PAD_COLORS[number];
    size: number;
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'system';
}

interface OpenRoll {
    padId: string;
    x: number;
    y: number;
}

const initialPads: BeatPad[] = [
    // 4x3 grid starting layout
    ...PAD_COLORS.slice(0, 12).map((color, i) => ({
        id: `pad-${i}`,
        x: (i % 4) * 130 - 200,
        y: Math.floor(i / 4) * 130 - 140,
        color,
        size: 110,
    })),
];

// Pre-seed notes so pads have content even before opening their roll
const initialPadNotes = new Map<string, Set<string>>([
    ['pad-0', new Set([
        'C3-0', 'C3-4', 'C3-8', 'C3-12',
        'C3-16', 'C3-20', 'C3-24', 'C3-28',
        'E3-2', 'E3-10', 'E3-18', 'E3-26',
    ])],
    ['pad-1', new Set([
        'D4-4', 'D4-12', 'D4-20', 'D4-28',
        'E4-6', 'E4-14', 'E4-22', 'E4-30',
        'F#4-7', 'F#4-15', 'F#4-23', 'F#4-31',
    ])],
]);

// Only one piano roll open at start
const initialOpenRoll: OpenRoll = { padId: 'pad-0', x: 500, y: -200 };

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

export default function Canvas002() {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
    const [dragging, setDragging] = useState<
        | { type: 'canvas' }
        | { type: 'pad'; id: string; offsetX: number; offsetY: number }
        | { type: 'pianoroll'; padId: string; offsetX: number; offsetY: number }
        | null
    >(null);
    const [pads, setPads] = useState(initialPads);
    const [activePad, setActivePad] = useState<string | null>(null);
    const [padNotes, setPadNotes] = useState(initialPadNotes);
    const [openRoll, setOpenRoll] = useState<OpenRoll | null>(initialOpenRoll);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'welcome', text: 'Type a message to drop a new beat pad onto the canvas.', from: 'system' },
    ]);
    const [input, setInput] = useState('');
    const [chatMinimized, setChatMinimized] = useState(false);
    const lastMouse = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const padCounter = useRef(initialPads.length);

    // --- Canvas dragging ---
    const handleMouseDown = useCallback((e: MouseEvent) => {
        setDragging({ type: 'canvas' });
        lastMouse.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    }, []);

    const handlePadDragStart = useCallback((e: MouseEvent, padId: string) => {
        const pad = pads.find((p) => p.id === padId);
        if (!pad) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
        const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;

        setDragging({ type: 'pad', id: padId, offsetX: canvasX - pad.x, offsetY: canvasY - pad.y });

        // Bring to front
        setPads((prev) => {
            const idx = prev.findIndex((p) => p.id === padId);
            if (idx === -1 || idx === prev.length - 1) return prev;
            const copy = [...prev];
            const [moved] = copy.splice(idx, 1);
            copy.push(moved);
            return copy;
        });

        e.preventDefault();
        e.stopPropagation();
    }, [pads, camera]);

    const handlePianoRollDragStart = useCallback((e: MouseEvent) => {
        if (!openRoll) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
        const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;

        setDragging({
            type: 'pianoroll',
            padId: openRoll.padId,
            offsetX: canvasX - openRoll.x,
            offsetY: canvasY - openRoll.y,
        });

        e.preventDefault();
        e.stopPropagation();
    }, [openRoll, camera]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging) return;

        if (dragging.type === 'canvas') {
            const dx = e.clientX - lastMouse.current.x;
            const dy = e.clientY - lastMouse.current.y;
            lastMouse.current = { x: e.clientX, y: e.clientY };
            setCamera((c) => ({ ...c, x: c.x + dx / c.zoom, y: c.y + dy / c.zoom }));
        } else if (dragging.type === 'pad') {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
            const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;
            setPads((prev) =>
                prev.map((p) =>
                    p.id === dragging.id
                        ? { ...p, x: canvasX - dragging.offsetX, y: canvasY - dragging.offsetY }
                        : p
                )
            );
        } else if (dragging.type === 'pianoroll') {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const canvasX = (e.clientX - rect.left - rect.width / 2) / camera.zoom - camera.x;
            const canvasY = (e.clientY - rect.top - rect.height / 2) / camera.zoom - camera.y;
            setOpenRoll((prev) =>
                prev && prev.padId === dragging.padId
                    ? { ...prev, x: canvasX - dragging.offsetX, y: canvasY - dragging.offsetY }
                    : prev
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

    // --- Pad tap (visual pulse) ---
    const handlePadTap = useCallback((padId: string) => {
        setActivePad(padId);
        setTimeout(() => setActivePad(null), 150);
    }, []);

    // --- Piano roll management (only one open at a time) ---
    const openPianoRoll = useCallback((padId: string) => {
        if (openRoll?.padId === padId) return;
        const pad = pads.find((p) => p.id === padId);
        if (!pad) return;

        setOpenRoll({
            padId,
            x: pad.x + pad.size + 40,
            y: pad.y - 50,
        });
    }, [openRoll, pads]);

    const closePianoRoll = useCallback(() => {
        setOpenRoll(null);
    }, []);

    const handleToggleNote = useCallback((padId: string, noteKey: string) => {
        setPadNotes((prev) => {
            const next = new Map(prev);
            const notes = new Set(next.get(padId) || []);
            if (notes.has(noteKey)) notes.delete(noteKey);
            else notes.add(noteKey);
            next.set(padId, notes);
            return next;
        });
    }, []);

    // --- Chat ---
    const handleSend = useCallback((e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        const color = PAD_COLORS[padCounter.current % PAD_COLORS.length];
        const newPadId = `pad-${padCounter.current}`;
        padCounter.current += 1;

        // Scatter new pads around the visible area
        const angle = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 200;
        const newPad: BeatPad = {
            id: newPadId,
            x: Math.round(Math.cos(angle) * radius),
            y: Math.round(Math.sin(angle) * radius),
            color,
            size: 110,
        };

        setPads((prev) => [...prev, newPad]);

        setMessages((prev) => [
            ...prev,
            { id: `user-${Date.now()}`, text, from: 'user' },
            { id: `sys-${Date.now()}`, text: `Dropped a ${color.label} pad onto the canvas.`, from: 'system' },
        ]);
        setInput('');

        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, [input]);

    // --- Helpers for rendering ---
    const hasPianoRoll = (padId: string) => openRoll?.padId === padId;

    return (
        <div className="canvas-002 h-dvh overflow-hidden bg-[#0c0a14] select-none font-mono">
            <BackToGallery position="top-left" />

            {/* Canvas viewport — dot grid lives here so it tiles infinitely */}
            <div
                ref={containerRef}
                className="canvas-dots w-full h-full cursor-grab active:cursor-grabbing"
                style={{
                    backgroundSize: `${28 * camera.zoom}px ${28 * camera.zoom}px`,
                    backgroundPosition: `${camera.x * camera.zoom + window.innerWidth / 2}px ${camera.y * camera.zoom + window.innerHeight / 2}px`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    className="w-full h-full"
                    style={{
                        transform: `translate(50%, 50%) scale(${camera.zoom}) translate(${camera.x}px, ${camera.y}px)`,
                        transformOrigin: '0 0',
                    }}
                >
                    {/* Tether line between pad and its piano roll */}
                    <svg
                        className="absolute pointer-events-none"
                        style={{ left: 0, top: 0, overflow: 'visible', zIndex: 0 }}
                        width="0"
                        height="0"
                    >
                        {openRoll && (() => {
                            const pad = pads.find((p) => p.id === openRoll.padId);
                            if (!pad) return null;
                            const padCx = pad.x + pad.size / 2;
                            const padCy = pad.y + pad.size / 2;
                            const prAx = openRoll.x;
                            const prAy = openRoll.y + 20;
                            const midX = (padCx + prAx) / 2;
                            return (
                                <g>
                                    <path
                                        d={`M ${padCx} ${padCy} C ${midX} ${padCy} ${midX} ${prAy} ${prAx} ${prAy}`}
                                        stroke={pad.color.glow}
                                        strokeOpacity={0.25}
                                        strokeWidth={2}
                                        strokeDasharray="6 4"
                                        fill="none"
                                    />
                                    <circle cx={padCx} cy={padCy} r={4} fill={pad.color.glow} fillOpacity={0.4} />
                                    <circle cx={prAx} cy={prAy} r={4} fill={pad.color.glow} fillOpacity={0.4} />
                                </g>
                            );
                        })()}
                    </svg>

                    {pads.map((pad, i) => (
                        <div
                            key={pad.id}
                            className="beat-pad group/pad absolute rounded-xl cursor-pointer transition-shadow"
                            style={{
                                left: pad.x,
                                top: pad.y,
                                width: pad.size,
                                height: pad.size,
                                backgroundColor: pad.color.bg,
                                boxShadow: activePad === pad.id
                                    ? `0 0 30px ${pad.color.glow}, 0 0 60px ${pad.color.glow}40, inset 0 0 20px ${pad.color.glow}60`
                                    : `0 0 12px ${pad.color.bg}40, inset 0 1px 0 ${pad.color.glow}30`,
                                zIndex: i + 1,
                            }}
                            onMouseDown={(e) => {
                                handlePadTap(pad.id);
                                handlePadDragStart(e, pad.id);
                            }}
                            onDoubleClick={() => openPianoRoll(pad.id)}
                        >
                            {/* Remove button */}
                            <button
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white/60 hover:bg-red-600 hover:text-white text-sm flex items-center justify-center opacity-0 group-hover/pad:opacity-100 transition-all cursor-pointer z-10"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setPads((prev) => prev.filter((p) => p.id !== pad.id));
                                    setOpenRoll((prev) => prev?.padId === pad.id ? null : prev);
                                    setPadNotes((prev) => { const next = new Map(prev); next.delete(pad.id); return next; });
                                }}
                            >
                                &times;
                            </button>
                            {/* Open piano roll button */}
                            {!hasPianoRoll(pad.id) && (
                                <button
                                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white/60 hover:text-white text-xs flex items-center justify-center opacity-0 group-hover/pad:opacity-100 transition-all cursor-pointer z-10"
                                    style={{ '--tw-bg-opacity': 1 } as React.CSSProperties}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        openPianoRoll(pad.id);
                                    }}
                                    title="Open piano roll"
                                >
                                    &#9835;
                                </button>
                            )}
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <span
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: pad.color.glow }}
                                >
                                    {pad.color.label}
                                </span>
                            </div>
                            {/* Pulse overlay */}
                            {activePad === pad.id && (
                                <div
                                    className="absolute inset-0 rounded-xl animate-ping-once"
                                    style={{ backgroundColor: `${pad.color.glow}30` }}
                                />
                            )}
                        </div>
                    ))}

                    {/* Piano roll (single) */}
                    {openRoll && (() => {
                        const pad = pads.find((p) => p.id === openRoll.padId);
                        if (!pad) return null;
                        return (
                            <PianoRoll
                                key={openRoll.padId}
                                x={openRoll.x}
                                y={openRoll.y}
                                zIndex={pads.length + 1}
                                padLabel={pad.color.label}
                                padBg={pad.color.bg}
                                padGlow={pad.color.glow}
                                notes={padNotes.get(openRoll.padId) || new Set()}
                                onToggleNote={(noteKey) => handleToggleNote(openRoll.padId, noteKey)}
                                onTitleBarMouseDown={handlePianoRollDragStart}
                                onClose={closePianoRoll}
                            />
                        );
                    })()}
                </div>
            </div>

            {/* HUD: zoom */}
            <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setCamera((c) => ({ ...c, zoom: Math.max(MIN_ZOOM, c.zoom - 0.1) }))}
                    className="text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                    &minus;
                </button>
                <span className="text-sm text-white/85 w-12 text-center">
                    {Math.round(camera.zoom * 100)}%
                </span>
                <button
                    onClick={() => setCamera((c) => ({ ...c, zoom: Math.min(MAX_ZOOM, c.zoom + 0.1) }))}
                    className="text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                    +
                </button>
            </div>

            {/* Chat window — fixed, not on canvas */}
            <div
                className="fixed right-12 z-50 w-[33vw] flex flex-col rounded-xl border border-white/10 bg-[#0e1a16]/95 backdrop-blur-md shadow-2xl shadow-black/60 transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                    bottom: 48,
                    height: chatMinimized ? 50 : 'calc(100dvh - 96px)',
                }}
            >
                {/* Chat header — always visible, doubles as toggle */}
                <div
                    className="shrink-0 flex items-center px-4 cursor-pointer"
                    style={{ height: 50 }}
                    onClick={() => setChatMinimized((v) => !v)}
                >
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-100">
                            Beat Chat
                        </h3>
                        {!chatMinimized && (
                            <p className="text-sm text-white/80 mt-0.5">
                                Send a message to add a pad
                            </p>
                        )}
                    </div>
                    <span
                        className="text-white/50 hover:text-white transition-transform duration-300 text-lg"
                        style={{ transform: chatMinimized ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        &#9660;
                    </span>
                </div>

                {/* Collapsible body */}
                {!chatMinimized && (
                    <>
                        <div className="border-t border-white/10" />

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 chat-scroll">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                                        msg.from === 'user'
                                            ? 'bg-emerald-600/30 text-emerald-100 ml-6'
                                            : 'bg-white/5 text-white/90 mr-6'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="shrink-0 p-3 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-emerald-500/50"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white transition-colors cursor-pointer"
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
