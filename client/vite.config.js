import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Controla a base via variável de ambiente ou pelo modo de build
  const envBase = process.env.VITE_BASE;
  let base;
  if (command === 'serve') {
    base = '/';
  } else if (envBase) {
    base = envBase;
  } else if (mode === 'railway') {
    base = '/';
  } else if (mode === 'github') {
    base = '/prescrimed/';
  } else {
    base = './';
  }

  return {
    plugins: [react()],
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', 'react-hot-toast'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
      },
    },
    preview: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0',
      strictPort: false,
    }
  };
});