import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    componentTagger()
  ],
  base: mode === 'preview' ? '' : '/',
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
      MODE: JSON.stringify(mode)
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: mode === 'preview'
  },
  build: {
    sourcemap: true,
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    target: 'esnext',
    minify: mode !== 'preview',
    manifest: true,
    rollupOptions: {
      input: mode === 'preview' ? {
        main: path.resolve(__dirname, 'index.html')
      } : undefined,
      output: {
        manualChunks: undefined
      }
    }
  }
}));
