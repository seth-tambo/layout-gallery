import { useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
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

export default function Canvas001() {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
    const [dragging, setDragging] = useState<{ type: 'canvas' } | { type: 'panel'; id: string; offsetX: number; offsetY: number } | null>(null);
    const [panels, setPanels] = useState(initialPanels);
    const lastMouse = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

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

        // Calculate where on the panel the user clicked (in canvas space)
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

            {/* HUD: zoom indicator */}
            <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 backdrop-blur-sm">
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
