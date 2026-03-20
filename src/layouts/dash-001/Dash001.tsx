import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './dash-001.css';

type WidgetType = 'stat' | 'bar-chart' | 'progress' | 'list';

interface DashWidget {
    id: string;
    type: WidgetType;
    title: string;
    value?: string;
    trend?: number;
    data?: number[];
    progress?: number;
    items?: { label: string; value: string }[];
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'ai';
    componentId?: string;
}

// --- Widget rendering ---

const CIRCUMFERENCE = 2 * Math.PI * 40;

function renderStat(widget: DashWidget) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider text-[#2a5a8a] mb-2">{widget.title}</p>
            <p className="text-2xl font-bold text-[#7eb8da]">{widget.value}</p>
            {widget.trend !== undefined && (
                <p className={`text-xs mt-1 ${widget.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {widget.trend >= 0 ? '↑' : '↓'} {Math.abs(widget.trend)}%
                </p>
            )}
        </div>
    );
}

function renderBarChart(widget: DashWidget) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider text-[#2a5a8a] mb-3">{widget.title}</p>
            <div className="flex items-end gap-1.5 h-24">
                {widget.data?.map((val, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t bg-[#4a90c4]/60"
                        style={{ height: `${val}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

function renderProgress(widget: DashWidget) {
    const pct = widget.progress ?? 0;
    const offset = CIRCUMFERENCE * (1 - pct / 100);
    return (
        <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-wider text-[#2a5a8a] mb-3">{widget.title}</p>
            <div className="relative inline-flex items-center justify-center">
                <svg width="96" height="96" className="transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#1e3a5f" strokeWidth="6" fill="none" />
                    <circle
                        cx="48" cy="48" r="40"
                        stroke="#4a90c4" strokeWidth="6" fill="none"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-lg font-bold text-[#7eb8da]">{pct}%</span>
            </div>
        </div>
    );
}

function renderList(widget: DashWidget) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider text-[#2a5a8a] mb-3">{widget.title}</p>
            <ul className="space-y-2">
                {widget.items?.map((item, i) => (
                    <li key={i} className="flex justify-between text-xs">
                        <span className="text-[#4a7a9e]">{item.label}</span>
                        <span className="text-[#7eb8da] font-bold">{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function renderWidget(widget: DashWidget) {
    switch (widget.type) {
        case 'stat':
            return renderStat(widget);
        case 'bar-chart':
            return renderBarChart(widget);
        case 'progress':
            return renderProgress(widget);
        case 'list':
            return renderList(widget);
    }
}

function renderMiniWidget(widget: DashWidget) {
    switch (widget.type) {
        case 'stat':
            return (
                <span className="text-[10px] text-[#4a7a9e]">
                    {widget.value}{' '}
                    {widget.trend !== undefined && (
                        <span className={widget.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {widget.trend >= 0 ? '↑' : '↓'}{Math.abs(widget.trend)}%
                        </span>
                    )}
                </span>
            );
        case 'bar-chart':
            return (
                <div className="flex items-end gap-0.5 h-4 mt-1">
                    {widget.data?.slice(0, 4).map((val, i) => (
                        <div key={i} className="w-2 rounded-t bg-[#4a90c4]/50" style={{ height: `${val}%` }} />
                    ))}
                </div>
            );
        case 'progress':
            return (
                <span className="text-[10px] text-[#4a7a9e]">
                    Progress: {widget.progress}%
                </span>
            );
        case 'list':
            return (
                <ul className="mt-1 space-y-0.5">
                    {widget.items?.slice(0, 2).map((item, i) => (
                        <li key={i} className="text-[10px] text-[#4a7a9e] flex justify-between gap-2">
                            <span>{item.label}</span>
                            <span className="text-[#7eb8da]">{item.value}</span>
                        </li>
                    ))}
                </ul>
            );
    }
}

// --- Initial data ---

const WIDGET_TYPES: WidgetType[] = ['stat', 'bar-chart', 'progress', 'list'];

const initialWidgets: DashWidget[] = [
    {
        id: 'w-1',
        type: 'stat',
        title: 'Total Revenue',
        value: '$84.2K',
        trend: 12.5,
    },
    {
        id: 'w-2',
        type: 'bar-chart',
        title: 'Weekly Signups',
        data: [45, 72, 58, 90, 64, 82, 76],
    },
    {
        id: 'w-3',
        type: 'progress',
        title: 'Sprint Completion',
        progress: 73,
    },
    {
        id: 'w-4',
        type: 'list',
        title: 'Top Pages',
        items: [
            { label: '/dashboard', value: '2,841' },
            { label: '/settings', value: '1,429' },
            { label: '/billing', value: '987' },
            { label: '/profile', value: '654' },
        ],
    },
];

const initialMessages: ChatMessage[] = [
    { id: 'ai-init', text: 'Welcome! I can generate dashboard widgets for you. Try asking for metrics, charts, or progress reports.', from: 'ai' },
    { id: 'ai-w1', text: 'Here is the revenue summary.', from: 'ai', componentId: 'w-1' },
    { id: 'ai-w2', text: 'Weekly signup trends are looking strong.', from: 'ai', componentId: 'w-2' },
];

// --- Helpers ---

function randomStat(): Partial<DashWidget> {
    const formats = [
        () => `${(Math.random() * 99 + 1).toFixed(1)}K`,
        () => `$${(Math.random() * 99 + 1).toFixed(1)}K`,
        () => `${Math.floor(Math.random() * 9000 + 1000).toLocaleString()}`,
        () => `${(Math.random() * 99 + 1).toFixed(0)}%`,
    ];
    const value = formats[Math.floor(Math.random() * formats.length)]();
    const trend = Math.round((Math.random() * 40 - 15) * 10) / 10;
    return { value, trend };
}

function randomBarData(): number[] {
    const count = 5 + Math.floor(Math.random() * 3);
    return Array.from({ length: count }, () => 20 + Math.floor(Math.random() * 80));
}

function randomProgress(): number {
    return 40 + Math.floor(Math.random() * 55);
}

function randomListItems(title: string): { label: string; value: string }[] {
    const words = title.split(/\s+/).filter(Boolean);
    const base = words[0] ?? 'Item';
    const suffixes = ['Alpha', 'Beta', 'Core', 'Edge', 'Prime'];
    const count = 4 + Math.floor(Math.random() * 2);
    return Array.from({ length: count }, (_, i) => ({
        label: `${base} ${suffixes[i % suffixes.length]}`,
        value: `${Math.floor(Math.random() * 9000 + 100).toLocaleString()}`,
    }));
}

const AI_RESPONSES: Record<WidgetType, string[]> = {
    stat: [
        'Here are the latest numbers.',
        'Metric generated — looking good!',
        'I pulled a fresh stat for you.',
    ],
    'bar-chart': [
        'Chart data is ready.',
        'Here is the trend breakdown.',
        'Bar chart added to the dashboard.',
    ],
    progress: [
        'Progress tracker added.',
        'Here is the completion status.',
        'Tracking progress for you.',
    ],
    list: [
        'Top items listed below.',
        'Here is the ranked data.',
        'List widget is live.',
    ],
};

// --- Component ---

let widgetCounter = initialWidgets.length;

export default function Dash001() {
    const [widgets, setWidgets] = useState<DashWidget[]>(initialWidgets);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [chatMinimized, setChatMinimized] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;

            const userMsg: ChatMessage = {
                id: `user-${Date.now()}`,
                text,
                from: 'user',
            };

            setMessages((prev) => [...prev, userMsg]);
            setInput('');

            // Simulate AI response after a short delay
            setTimeout(() => {
                const type = WIDGET_TYPES[Math.floor(Math.random() * WIDGET_TYPES.length)];
                widgetCounter += 1;
                const widgetId = `w-${widgetCounter}`;

                let widgetData: Partial<DashWidget> = {};
                switch (type) {
                    case 'stat':
                        widgetData = randomStat();
                        break;
                    case 'bar-chart':
                        widgetData = { data: randomBarData() };
                        break;
                    case 'progress':
                        widgetData = { progress: randomProgress() };
                        break;
                    case 'list':
                        widgetData = { items: randomListItems(text) };
                        break;
                }

                const newWidget: DashWidget = {
                    id: widgetId,
                    type,
                    title: text,
                    ...widgetData,
                };

                const responses = AI_RESPONSES[type];
                const aiText = responses[Math.floor(Math.random() * responses.length)];

                const aiMsg: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    text: aiText,
                    from: 'ai',
                    componentId: widgetId,
                };

                setWidgets((prev) => [...prev, newWidget]);
                setMessages((prev) => [...prev, aiMsg]);
            }, 300);
        },
        [input],
    );

    const toggleChat = useCallback(() => {
        setChatMinimized((v) => !v);
    }, []);

    // Find widget for a chat message that references one
    const findWidget = useCallback(
        (componentId: string) => widgets.find((w) => w.id === componentId),
        [widgets],
    );

    return (
        <div className="dash-001 h-dvh overflow-hidden bg-[#0a1628] font-mono flex">
            <BackToGallery />

            {/* Left: Tambo Chat Panel — desktop */}
            <div className="hidden lg:flex w-80 shrink-0 border-r border-[#1e3a5f] bg-[#0b1a30] flex-col">
                {/* Chat header */}
                <div
                    onClick={toggleChat}
                    className="shrink-0 px-4 py-3 cursor-pointer border-b border-[#1e3a5f] flex items-center justify-between select-none"
                >
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#7eb8da]">Tambo</h3>
                        {!chatMinimized && (
                            <p className="text-xs text-[#4a7a9e] mt-0.5">Dashboard Assistant</p>
                        )}
                    </div>
                    <span
                        className="text-[#4a7a9e] transition-transform duration-200"
                        style={{ transform: chatMinimized ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                    >
                        &#9660;
                    </span>
                </div>

                {!chatMinimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 chat-scroll">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                                        msg.from === 'user'
                                            ? 'bg-[#1e3a5f]/50 text-[#7eb8da] ml-6'
                                            : 'bg-white/5 text-[#4a7a9e] mr-4'
                                    }`}
                                >
                                    {msg.text}
                                    {msg.componentId && (() => {
                                        const linked = findWidget(msg.componentId);
                                        if (!linked) return null;
                                        return (
                                            <div className="mt-2 pt-2 border-t border-[#1e3a5f]/50">
                                                {renderMiniWidget(linked)}
                                            </div>
                                        );
                                    })()}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="shrink-0 p-3 border-t border-[#1e3a5f]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for a metric..."
                                    className="flex-1 bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-[#7eb8da] placeholder-[#2a5a8a] focus:outline-none focus:border-[#4a90c4]/50"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-2 rounded-lg bg-[#1e3a5f] hover:bg-[#2a5a8a] text-sm font-bold text-[#7eb8da] transition-colors cursor-pointer"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* Main dashboard grid */}
            <main className="flex-1 overflow-y-auto dash-scroll p-4 lg:p-6">
                {/* Dashboard header */}
                <div className="mb-6">
                    <h1 className="text-lg text-[#6aaad0] mb-1">Analytics Dashboard</h1>
                    <p className="text-xs text-[#2a5a8a]">Ask Tambo to generate metrics and widgets</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                    {widgets.map((widget) => (
                        <div
                            key={widget.id}
                            className="widget-enter border border-[#1e3a5f] rounded-lg bg-[#0b1a30] p-4"
                        >
                            {renderWidget(widget)}
                        </div>
                    ))}
                </div>
            </main>

            {/* Mobile: bottom chat sheet */}
            <MobileChatSheet
                messages={messages}
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                findWidget={findWidget}
                chatEndRef={chatEndRef}
            />
        </div>
    );
}

// --- Mobile chat bottom sheet ---

function MobileChatSheet({
    messages,
    input,
    onInputChange,
    onSend,
    findWidget,
    chatEndRef,
}: {
    messages: ChatMessage[];
    input: string;
    onInputChange: (v: string) => void;
    onSend: (e: FormEvent) => void;
    findWidget: (id: string) => DashWidget | undefined;
    chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40">
            {/* Toggle bar */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full px-4 py-2 bg-[#0b1a30] border-t border-[#1e3a5f] flex items-center justify-between cursor-pointer"
            >
                <span className="text-xs font-bold uppercase tracking-wider text-[#7eb8da]">
                    Tambo Chat
                </span>
                <span
                    className="text-[#4a7a9e] transition-transform duration-200 text-sm"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    &#9650;
                </span>
            </button>

            {open && (
                <div className="bg-[#0b1a30] border-t border-[#1e3a5f] flex flex-col" style={{ height: '50dvh' }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 chat-scroll">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                                    msg.from === 'user'
                                        ? 'bg-[#1e3a5f]/50 text-[#7eb8da] ml-6'
                                        : 'bg-white/5 text-[#4a7a9e] mr-4'
                                }`}
                            >
                                {msg.text}
                                {msg.componentId && (() => {
                                    const linked = findWidget(msg.componentId);
                                    if (!linked) return null;
                                    return (
                                        <div className="mt-2 pt-2 border-t border-[#1e3a5f]/50">
                                            {renderMiniWidget(linked)}
                                        </div>
                                    );
                                })()}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={onSend} className="shrink-0 p-3 border-t border-[#1e3a5f]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => onInputChange(e.target.value)}
                                placeholder="Ask for a metric..."
                                className="flex-1 bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-[#7eb8da] placeholder-[#2a5a8a] focus:outline-none focus:border-[#4a90c4]/50"
                            />
                            <button
                                type="submit"
                                className="px-3 py-2 rounded-lg bg-[#1e3a5f] hover:bg-[#2a5a8a] text-sm font-bold text-[#7eb8da] transition-colors cursor-pointer"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
