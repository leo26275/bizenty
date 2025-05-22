
//import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import 'primereact/resources/themes/lara-light-blue/theme.css'; // Probar con este u otro más actualizado

import { LayoutProvider } from '@/Layouts/Context/layoutcontext';

import 'primereact/resources/primereact.min.css';                  // componentes
import 'primeicons/primeicons.css';                                // iconos
import 'primeflex/primeflex.css';                                  // utilidades opcionales

import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LayoutProvider>
                <App {...props} />
            </LayoutProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
