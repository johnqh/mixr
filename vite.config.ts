import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Check if we should use local or npm version of libraries
const useLocalLib = process.env.USE_LOCAL_LIB === 'true' || process.env.NODE_ENV === 'development';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    alias: {
      ...(useLocalLib
        ? {
            '@sudobility/mixr_lib': path.resolve(__dirname, '../mixr_lib'),
            '@sudobility/mixr_client': path.resolve(__dirname, '../mixr_client'),
          }
        : {}),
    },
  },
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: id => {
          // React Core
          if (
            id.includes('node_modules/react/index.js') ||
            id.includes('node_modules/react-dom/client.js')
          ) {
            return 'react-core';
          }

          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }

          // Query
          if (id.includes('node_modules/@tanstack/')) {
            return 'query';
          }

          // Firebase
          if (id.includes('node_modules/firebase/app')) {
            return 'firebase-app';
          }
          if (id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth';
          }
          if (id.includes('node_modules/firebase/')) {
            return 'firebase-utils';
          }

          // UI Libraries
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-ui';
          }
          if (id.includes('node_modules/@heroicons/')) {
            return 'heroicons';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }

          // UI Utils
          if (
            id.includes('node_modules/class-variance-authority') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge')
          ) {
            return 'ui-utils';
          }

          // Vendor packages
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    host: true,
    port: 5174,
    strictPort: false,
  },
});
