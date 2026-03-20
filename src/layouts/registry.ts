import { lazy } from 'react';
import type { ComponentType } from 'react';

export interface LayoutEntry {
    slug: string;
    name: string;
    description: string;
    category: string;
    component: React.LazyExoticComponent<ComponentType>;
}

export const categories = [
    { id: 'multi-column', label: 'Multi-Column', description: 'Fixed-viewport column structures with independent scroll regions' },
    { id: 'slide-overlay', label: 'Slide & Overlay', description: 'Layouts with panels, drawers, or layers that slide over content' },
    { id: 'canvas', label: 'Infinite Canvas', description: 'Pannable, zoomable workspaces with floating elements in unbounded space' },
] as const;

export const layouts: LayoutEntry[] = [
    {
        slug: 'blueprint-001',
        name: 'Blueprint 001',
        description: 'Three-column layout with independent scroll, fixed viewport, and blueprint aesthetic.',
        category: 'multi-column',
        component: lazy(() => import('./blueprint-001/Blueprint001.tsx')),
    },
    {
        slug: 'blueprint-002',
        name: 'Blueprint 002',
        description: 'Three-column layout with a slide-over detail panel that reveals a fourth layer on demand.',
        category: 'slide-overlay',
        component: lazy(() => import('./blueprint-002/Blueprint002.tsx')),
    },
    {
        slug: 'canvas-001',
        name: 'Canvas 001',
        description: 'Infinite canvas with draggable floating panels, zoom controls, and a dot-grid background.',
        category: 'canvas',
        component: lazy(() => import('./canvas-001/Canvas001.tsx')),
    },
    {
        slug: 'canvas-002',
        name: 'Canvas 002 — Beat Pads',
        description: 'Musician\'s canvas with draggable beat pads and a stationary chat window that spawns new pads.',
        category: 'canvas',
        component: lazy(() => import('./canvas-002/Canvas002.tsx')),
    },
    {
        slug: 'feed-001',
        name: 'Feed 001 — Social Stream',
        description: 'Single-column social feed with timeline rail and a Tambo chat panel that generates post cards.',
        category: 'slide-overlay',
        component: lazy(() => import('./feed-001/Feed001.tsx')),
    },
    {
        slug: 'shop-001',
        name: 'Shop 001 — Product Grid',
        description: 'E-commerce storefront with filterable product grid, cart, and a Tambo chat bar that generates new products.',
        category: 'multi-column',
        component: lazy(() => import('./shop-001/Shop001.tsx')),
    },
    {
        slug: 'dash-001',
        name: 'Dash 001 — Metric Dashboard',
        description: 'Analytics dashboard with metric cards, charts, and progress rings generated via Tambo chat.',
        category: 'multi-column',
        component: lazy(() => import('./dash-001/Dash001.tsx')),
    },
];
