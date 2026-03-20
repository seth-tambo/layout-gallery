import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { BackToGallery } from '../../shared/BackToGallery.tsx';
import './shop-001.css';

interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    color: string;
    category: string;
}

interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'ai';
    componentId?: string;
}

const PRODUCT_COLORS = [
    '#2a4a7a', '#3a6a5a', '#6a3a6a', '#7a5a2a',
    '#2a5a6a', '#5a3a2a', '#3a3a7a', '#6a6a2a',
    '#4a2a6a', '#2a6a4a',
];

const CATEGORIES = ['Electronics', 'Accessories', 'Apparel', 'Home', 'Tools'];

function randomColor(): string {
    return PRODUCT_COLORS[Math.floor(Math.random() * PRODUCT_COLORS.length)];
}

function randomCategory(): string {
    return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

function randomPrice(): number {
    return Math.round((Math.random() * 290 + 9.99) * 100) / 100;
}

function randomRating(): number {
    return Math.floor(Math.random() * 3) + 3;
}

const INITIAL_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Wireless Earbuds Pro', price: 79.99, rating: 4, color: '#2a4a7a', category: 'Electronics' },
    { id: 'p2', name: 'Canvas Backpack', price: 49.99, rating: 5, color: '#3a6a5a', category: 'Accessories' },
    { id: 'p3', name: 'Merino Wool Hoodie', price: 129.99, rating: 4, color: '#6a3a6a', category: 'Apparel' },
    { id: 'p4', name: 'Desk Organizer Set', price: 34.99, rating: 3, color: '#7a5a2a', category: 'Home' },
    { id: 'p5', name: 'USB-C Hub 7-in-1', price: 59.99, rating: 5, color: '#2a5a6a', category: 'Electronics' },
    { id: 'p6', name: 'Titanium Multi-Tool', price: 89.99, rating: 4, color: '#5a3a2a', category: 'Tools' },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 'm1', from: 'ai', text: 'Welcome to Blueprint Store! I can add new products for you. Just tell me what you need.' },
    { id: 'm2', from: 'user', text: 'Add a titanium multi-tool' },
    { id: 'm3', from: 'ai', text: "I've added this product to your store:", componentId: 'p6' },
];

let nextId = 7;

export default function Shop001() {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [chatExpanded, setChatExpanded] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatExpanded) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, chatExpanded]);

    const handleSend = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            const trimmed = input.trim();
            if (!trimmed) return;

            const userMsgId = `m${nextId++}`;
            const userMsg: ChatMessage = { id: userMsgId, from: 'user', text: trimmed };

            setMessages(prev => [...prev, userMsg]);
            setInput('');

            setTimeout(() => {
                const productId = `p${nextId++}`;
                const aiMsgId = `m${nextId++}`;

                const newProduct: Product = {
                    id: productId,
                    name: trimmed,
                    price: randomPrice(),
                    rating: randomRating(),
                    color: randomColor(),
                    category: randomCategory(),
                };

                const aiMsg: ChatMessage = {
                    id: aiMsgId,
                    from: 'ai',
                    text: "I've added this product to your store:",
                    componentId: productId,
                };

                setProducts(prev => [...prev, newProduct]);
                setMessages(prev => [...prev, aiMsg]);
            }, 300);
        },
        [input],
    );

    const renderProductPreview = (msg: ChatMessage) => {
        if (!msg.componentId) return null;
        const linkedProduct = products.find(p => p.id === msg.componentId);
        if (!linkedProduct) return null;

        return (
            <div className="mt-1.5 flex items-center gap-2 rounded border border-[#1e3a5f] bg-[#0a1628] p-2">
                <div
                    className="h-8 w-8 shrink-0 rounded"
                    style={{ backgroundColor: linkedProduct.color }}
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-[#7eb8da]">{linkedProduct.name}</p>
                    <p className="text-[10px] text-[#4a90c4]">${linkedProduct.price.toFixed(2)}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="shop-001 h-dvh overflow-hidden bg-[#0a1628] font-mono flex flex-col">
            <BackToGallery />

            {/* Header */}
            <header className="shrink-0 border-b border-[#1e3a5f] bg-[#0d1f3c] px-4 py-3 flex items-center justify-between">
                <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-[#4a90c4]">
                    Blueprint Store
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-[#4a7a9e]">Cart ({cartCount})</span>
                </div>
            </header>

            {/* Main area: sidebar + grid */}
            <div className="flex flex-1 min-h-0">
                {/* Sidebar (desktop only) */}
                <aside className="hidden lg:block w-48 shrink-0 border-r border-[#1e3a5f] bg-[#0b1a30] p-4">
                    <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#2a5a8a] mb-4">
                        Categories
                    </h2>
                    <ul className="space-y-2">
                        {CATEGORIES.map(cat => (
                            <li
                                key={cat}
                                className="text-xs text-[#4a7a9e] hover:text-[#7eb8da] cursor-pointer px-2 py-1.5 rounded hover:bg-[#111f38] transition-colors"
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>

                    {/* Decorative price range filter */}
                    <div className="mt-6">
                        <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#2a5a8a] mb-3">
                            Price Range
                        </h2>
                        <div className="h-1 bg-[#1e3a5f] rounded-full mb-1">
                            <div className="h-1 bg-[#4a90c4] rounded-full w-3/5" />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#2a4a6a]">
                            <span>$0</span>
                            <span>$300</span>
                        </div>
                    </div>

                    {/* Decorative rating filter */}
                    <div className="mt-6">
                        <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#2a5a8a] mb-3">
                            Min Rating
                        </h2>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-[#4a90c4]' : 'bg-[#1e3a5f]'}`}
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product grid */}
                <main className="flex-1 overflow-y-auto grid-scroll p-4 lg:p-6">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="product-enter border border-[#1e3a5f] rounded-lg bg-[#0b1a30] overflow-hidden"
                            >
                                {/* Color placeholder image */}
                                <div className="h-32 w-full" style={{ backgroundColor: product.color }} />
                                <div className="p-3">
                                    <h3 className="text-xs font-bold text-[#7eb8da] mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-[#2a5a8a] mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#4a90c4]">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${i < product.rating ? 'bg-[#4a90c4]' : 'bg-[#1e3a5f]'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCartCount(c => c + 1)}
                                        className="mt-3 w-full py-1.5 rounded text-[10px] uppercase tracking-wider border border-[#1e3a5f] text-[#4a7a9e] hover:bg-[#1a3555] hover:text-[#7eb8da] transition-colors cursor-pointer"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Bottom Tambo chat bar */}
            <div
                className="shrink-0 border-t border-[#1e3a5f] bg-[#0b1a30]/95 backdrop-blur-md transition-all duration-300"
                style={{ height: chatExpanded ? 320 : 48 }}
            >
                {/* Chat header */}
                <div
                    onClick={() => setChatExpanded(v => !v)}
                    className="h-12 px-4 flex items-center cursor-pointer"
                >
                    <div className="flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#7eb8da]">
                            Tambo
                        </h3>
                    </div>
                    {!chatExpanded && (
                        <p className="text-xs text-[#4a7a9e] mr-3">Ask me to add products...</p>
                    )}
                    <span
                        className="text-[#4a7a9e] transition-transform duration-300"
                        style={{ transform: chatExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        &#9650;
                    </span>
                </div>

                {chatExpanded && (
                    <>
                        <div className="border-t border-[#1e3a5f]" />

                        {/* Messages */}
                        <div
                            className="overflow-y-auto chat-scroll px-4 py-2 space-y-2"
                            style={{ height: 'calc(100% - 48px - 56px)' }}
                        >
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-lg px-3 py-2 ${
                                            msg.from === 'user'
                                                ? 'bg-[#1a3555] text-[#7eb8da]'
                                                : 'bg-[#0d1f3c] text-[#4a7a9e] border border-[#1e3a5f]'
                                        }`}
                                    >
                                        <p className="text-xs leading-relaxed">{msg.text}</p>
                                        {renderProductPreview(msg)}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="px-4 py-2 border-t border-[#1e3a5f]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Describe a product to add..."
                                    className="flex-1 bg-[#0a1628] border border-[#1e3a5f] rounded px-3 py-2 text-xs text-[#7eb8da] placeholder-[#2a4a6a] outline-none focus:border-[#4a90c4] transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded text-[10px] uppercase tracking-wider bg-[#1a3555] text-[#7eb8da] border border-[#1e3a5f] hover:bg-[#254a6a] transition-colors cursor-pointer"
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
