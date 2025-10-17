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
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(mode)
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    force: mode === 'preview',
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true,
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    target: 'esnext',
    minify: mode !== 'preview',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor';
            }
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui';
            }
            return 'deps';
          }
        }
      }
    }
  }
}));
