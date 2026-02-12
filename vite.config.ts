import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { serviceWorkerPlugin } from '@sudobility/di_web/vite';
import path from 'path';

// Check if we should use local or npm version of libraries
const useLocalLib =
  process.env.USE_LOCAL_LIB === 'true' || process.env.NODE_ENV === 'development';

export default defineConfig({
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'react-helmet-async',
      '@sudobility/components',
      '@sudobility/building_blocks',
      '@sudobility/auth-components',
      '@sudobility/devops-components',
    ],
    alias: {
      // Ensure all packages use the same React instance
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      ...(useLocalLib
        ? {
            '@sudobility/mixr_lib': path.resolve(__dirname, '../mixr_lib'),
            '@sudobility/mixr_client': path.resolve(__dirname, '../mixr_client'),
          }
        : {}),
    },
  },
  plugins: [react(), serviceWorkerPlugin()],
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
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      // Externalize optional dependencies that may not be installed
      external: ['@sudobility/subscription_lib'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core - must be first and in single chunk
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-is/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }
            // React Router
            if (id.includes('node_modules/react-router')) {
              return 'vendor-router';
            }
            // Firebase
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // i18n libraries
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            // TanStack Query
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack';
            }
            // Radix UI
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Icons
            if (id.includes('@heroicons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
          // Let Rollup handle other dependencies naturally
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth'],
  },
  server: {
    host: true,
    port: 6173,
    strictPort: false,
  },
});
