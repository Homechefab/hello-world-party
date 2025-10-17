import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    mode === 'preview' ? componentTagger() : null
  ].filter(Boolean),
  base: mode === 'preview' ? './' : '/',
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      VITE_MODE: JSON.stringify(mode),
      IS_PREVIEW: mode === 'preview'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    entries: [
      'src/**/*.{ts,tsx}',
      'src/*.{ts,tsx}'
    ],
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime'
    ]
  },
  build: {
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    sourcemap: true,
    minify: false,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      external: mode === 'preview' ? ['lovable-tagger'] : undefined,
      output: {
        format: 'esm',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}));
