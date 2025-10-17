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
    mode === 'preview' && componentTagger()
  ].filter(Boolean),
  base: mode === 'preview' ? '' : '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'preview' ? 'development' : mode),
    'process.env.VITE_APP_ENV': JSON.stringify(mode),
    'global': 'globalThis',
    'window.gsapscriptloaded': 'true'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'react': path.resolve(__dirname, './node_modules/react')
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
    assetsInlineLimit: 0,
    rollupOptions: {
      external: mode === 'preview' ? ['lovable-tagger'] : [],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'tsx'
  }
}));
