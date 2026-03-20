import { createBrowserRouter } from 'react-router';
import Gallery from './gallery/Gallery.tsx';
import LayoutPage from './layouts/LayoutPage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Gallery,
    },
    {
        path: '/layouts/:slug',
        Component: LayoutPage,
    },
], { basename: import.meta.env.BASE_URL });
