import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isPreview = mode === 'preview';
  const isDev = mode === 'development';
  
  return {
    server: {
      host: "localhost",
      port: 8080,
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
      outDir: isPreview ? 'dist-preview' : 'dist',
      target: 'esnext',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, isPreview ? 'preview.html' : 'index.html'),
        },
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  };
});
