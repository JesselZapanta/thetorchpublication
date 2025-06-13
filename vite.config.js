import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: true, // Listen on all network interfaces
    //     port: 3000,
    //     hmr: {
    //         host: "192.168.123.4", // Your IPv4 address
    //     },
    // },
});
