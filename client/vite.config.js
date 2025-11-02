import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 * 
 * Vite is a modern frontend build tool that provides:
 * - Lightning-fast HMR (Hot Module Replacement)
 * - Native ES modules during development
 * - Optimized production builds with Rollup
 * - Built-in TypeScript support
 * 
 * Alternative bundlers:
 * - Webpack: More mature, extensive ecosystem, slower dev server
 * - Parcel: Zero-config, good for simple projects
 * - esbuild: Extremely fast but less features
 * - Turbopack: Next.js's new bundler, promising performance
 * 
 * Why Vite:
 * - Instant server start (no bundling in dev)
 * - Fast HMR regardless of app size
 * - Modern by default (ES2020, dynamic imports)
 * - Simple configuration
 * - Great React integration
 */

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for React
      fastRefresh: true,
      // Babel options for additional transformations
      babel: {
        plugins: [],
      },
    }),
  ],

  // Path resolution aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses (0.0.0.0)
    open: true, // Auto-open browser on start
    cors: true,
    // Proxy API requests to backend server
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate sourcemaps for debugging
    // Increase chunk size warning limit (default: 500 KB)
    chunkSizeWarningLimit: 1000,
    // Rollup options for advanced configuration
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Three.js and related libraries (large)
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          // Charts and visualization
          charts: ['recharts', 'd3'],
          // UI framework
          antd: ['antd', '@ant-design/icons'],
          // Socket.IO client
          socketio: ['socket.io-client'],
        },
      },
    },
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // Optimization options
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'socket.io-client',
    ],
    exclude: [], // Dependencies to exclude from pre-bundling
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
    },
  },

  // Preview server configuration (for testing production build)
  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // Environment variable prefix
  envPrefix: 'VITE_',

  // Enable/disable features
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
