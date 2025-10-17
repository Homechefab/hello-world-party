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
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'preview' ? 'development' : mode),
    global: 'window'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: mode === 'preview' ? ['lovable-tagger'] : []
  },
  build: {
    sourcemap: true,
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    target: 'esnext',
    minify: false,
    rollupOptions: {
      external: mode === 'preview' ? ['lovable-tagger'] : [],
      preserveEntrySignatures: 'strict',
      output: {
        format: 'esm',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}));
