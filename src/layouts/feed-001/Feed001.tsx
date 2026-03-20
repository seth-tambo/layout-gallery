import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './feed-001.css';

interface FeedPost {
    id: string;
    username: string;
    handle: string;
    text: string;
    likes: number;
    reposts: number;
    timestamp: string;
    accentColor: string;
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'ai';
    componentId?: string;
}

const ACCENT_COLORS = [
    '#22d3ee', // cyan
    '#38bdf8', // sky
    '#818cf8', // indigo
    '#a78bfa', // violet
    '#2dd4bf', // teal
    '#34d399', // emerald
    '#60a5fa', // blue
    '#c084fc', // purple
];

const HANDLES = [
    '@designbot',
    '@layoutai',
    '@pixelforge',
    '@gridmaster',
    '@uicrafter',
    '@schematics',
    '@wireframr',
    '@compstack',
    '@typelayer',
    '@renderloop',
];

const USERNAMES = [
    'DesignBot',
    'LayoutAI',
    'PixelForge',
    'GridMaster',
    'UI Crafter',
    'Schematics',
    'Wireframr',
    'CompStack',
    'TypeLayer',
    'RenderLoop',
];

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function makeTimestamp(minutesAgo: number): string {
    if (minutesAgo < 60) return `${minutesAgo}m`;
    if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}h`;
    return `${Math.floor(minutesAgo / 1440)}d`;
}

const initialPosts: FeedPost[] = [
    {
        id: 'seed-1',
        username: 'GridMaster',
        handle: '@gridmaster',
        text: 'Just shipped a new responsive grid system. 12 columns, fluid gutters, and it collapses gracefully on mobile. No framework needed.',
        likes: 42,
        reposts: 8,
        timestamp: '15m',
        accentColor: ACCENT_COLORS[0],
    },
    {
        id: 'seed-2',
        username: 'PixelForge',
        handle: '@pixelforge',
        text: 'Hot take: design tokens are the most underrated part of any design system. Get your spacing scale right and everything else follows.',
        likes: 128,
        reposts: 34,
        timestamp: '1h',
        accentColor: ACCENT_COLORS[2],
    },
    {
        id: 'seed-3',
        username: 'UI Crafter',
        handle: '@uicrafter',
        text: 'Experimenting with container queries for card layouts. The future of responsive design is component-level, not viewport-level.',
        likes: 73,
        reposts: 19,
        timestamp: '3h',
        accentColor: ACCENT_COLORS[4],
    },
    {
        id: 'seed-4',
        username: 'RenderLoop',
        handle: '@renderloop',
        text: 'Reduced our bundle size by 40% by lazy-loading layout components. Each pattern loads only when you navigate to it.',
        likes: 95,
        reposts: 22,
        timestamp: '5h',
        accentColor: ACCENT_COLORS[6],
    },
];

const initialMessages: ChatMessage[] = [
    {
        id: 'ai-welcome',
        text: 'Welcome to the social feed. Type a message and I\'ll post it to the timeline for you.',
        from: 'ai',
    },
    {
        id: 'user-seed-1',
        text: 'Post something about grid systems',
        from: 'user',
    },
    {
        id: 'ai-seed-1',
        text: 'Here\'s your post on the feed:',
        from: 'ai',
        componentId: 'seed-1',
    },
];

let postCounter = initialPosts.length;

export default function Feed001() {
    const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
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

            const userMsgId = `user-${Date.now()}`;
            const aiMsgId = `ai-${Date.now()}`;
            const newPostId = `post-${postCounter++}`;

            const userMsg: ChatMessage = {
                id: userMsgId,
                text,
                from: 'user',
            };

            setMessages((prev) => [...prev, userMsg]);
            setInput('');

            // Simulated AI delay
            setTimeout(() => {
                const handleIdx = Math.floor(Math.random() * HANDLES.length);
                const newPost: FeedPost = {
                    id: newPostId,
                    username: USERNAMES[handleIdx],
                    handle: HANDLES[handleIdx],
                    text,
                    likes: Math.floor(Math.random() * 50) + 1,
                    reposts: Math.floor(Math.random() * 15),
                    timestamp: makeTimestamp(Math.floor(Math.random() * 5)),
                    accentColor: randomFrom(ACCENT_COLORS),
                };

                const aiMsg: ChatMessage = {
                    id: aiMsgId,
                    text: "Here's your post on the feed:",
                    from: 'ai',
                    componentId: newPostId,
                };

                setPosts((prev) => [newPost, ...prev]);
                setMessages((prev) => [...prev, aiMsg]);
            }, 300);
        },
        [input],
    );

    const renderMiniPost = (msg: ChatMessage) => {
        if (!msg.componentId) return null;
        const linkedPost = posts.find((p) => p.id === msg.componentId);
        if (!linkedPost) return null;
        return (
            <div className="mt-2 border border-[#1e3a5f] rounded bg-[#0a1628]/60 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: linkedPost.accentColor }}
                    />
                    <span className="text-[10px] text-[#4a7a9e]">
                        {linkedPost.handle}
                    </span>
                </div>
                <p className="text-xs text-[#7eb8da]/80 leading-snug line-clamp-2">
                    {linkedPost.text}
                </p>
            </div>
        );
    };

    const chatContent = (
        <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 chat-scroll">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={
                            msg.from === 'user'
                                ? 'ml-6 rounded-lg px-3 py-2 bg-[#1a3a5f]/60 text-sm text-[#7eb8da] leading-relaxed'
                                : 'mr-6 rounded-lg px-3 py-2 bg-[#0a1628]/80 text-sm text-[#7eb8da]/90 leading-relaxed'
                        }
                    >
                        {msg.text}
                        {renderMiniPost(msg)}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <form
                onSubmit={handleSend}
                className="shrink-0 p-3 border-t border-[#1e3a5f]"
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message to post..."
                        className="flex-1 bg-[#0a1628]/60 border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-[#7eb8da] placeholder-[#2a5a8a] focus:outline-none focus:border-[#4a90c4]/50"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 rounded-lg bg-[#1a3a5f] hover:bg-[#2a4a6f] text-sm font-bold text-[#7eb8da] transition-colors cursor-pointer"
                    >
                        Send
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <div className="feed-001 h-dvh overflow-hidden bg-[#0a1628] font-mono flex">
            <BackToGallery />

            {/* Left: Tambo Chat Panel — desktop */}
            <div className="hidden lg:flex w-80 shrink-0 border-r border-[#1e3a5f] bg-[#0b1a30] flex-col">
                {/* Chat header */}
                <div
                    onClick={() => setChatMinimized((v) => !v)}
                    className="shrink-0 px-4 py-3 cursor-pointer border-b border-[#1e3a5f] flex items-center justify-between"
                >
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#7eb8da]">
                            Tambo
                        </h3>
                        {!chatMinimized && (
                            <p className="text-xs text-[#4a7a9e] mt-0.5">
                                Generative UI Chat
                            </p>
                        )}
                    </div>
                    <span
                        className="text-[#4a7a9e] transition-transform duration-300"
                        style={{
                            transform: chatMinimized
                                ? 'rotate(-90deg)'
                                : 'rotate(0deg)',
                        }}
                    >
                        &#9660;
                    </span>
                </div>

                {!chatMinimized && chatContent}
            </div>

            {/* Center: Feed column */}
            <div className="flex-1 overflow-y-auto feed-scroll">
                <div className="max-w-lg mx-auto py-6 px-4 relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-[#1e3a5f]" />

                    {/* Posts */}
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="feed-enter relative pl-16 mb-6"
                        >
                            {/* Timeline dot */}
                            <div
                                className="absolute left-[29px] top-4 w-3 h-3 rounded-full border-2"
                                style={{
                                    borderColor: post.accentColor,
                                    backgroundColor: `${post.accentColor}30`,
                                }}
                            />

                            {/* Post card */}
                            <div className="border border-[#1e3a5f] rounded-lg bg-[#0b1a30] p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-[#7eb8da]">
                                        {post.username}
                                    </span>
                                    <span className="text-xs text-[#2a5a8a]">
                                        {post.handle}
                                    </span>
                                    <span className="text-xs text-[#2a4a6a] ml-auto">
                                        {post.timestamp}
                                    </span>
                                </div>
                                <p className="text-sm text-[#7eb8da] leading-relaxed mb-3">
                                    {post.text}
                                </p>
                                <div className="flex gap-4 text-xs text-[#4a7a9e]">
                                    <span>&hearts; {post.likes}</span>
                                    <span>&#8635; {post.reposts}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile: bottom chat sheet */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40">
                <div className="bg-[#0b1a30] border-t border-[#1e3a5f] flex flex-col max-h-[60dvh]">
                    {/* Mobile chat header */}
                    <div
                        onClick={() => setChatMinimized((v) => !v)}
                        className="shrink-0 px-4 py-3 cursor-pointer flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7eb8da]">
                                Tambo
                            </h3>
                            {!chatMinimized && (
                                <p className="text-xs text-[#4a7a9e] mt-0.5">
                                    Generative UI Chat
                                </p>
                            )}
                        </div>
                        <span
                            className="text-[#4a7a9e] transition-transform duration-300"
                            style={{
                                transform: chatMinimized
                                    ? 'rotate(180deg)'
                                    : 'rotate(0deg)',
                            }}
                        >
                            &#9660;
                        </span>
                    </div>

                    {!chatMinimized && chatContent}
                </div>
            </div>
        </div>
    );
}
