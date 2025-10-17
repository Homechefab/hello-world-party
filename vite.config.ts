import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), componentTagger()],
  build: {
    outDir: 'dist-preview',
    target: 'esnext',
    minify: false,
    rollupOptions: {
      external: [
        '@emotion/react/jsx-runtime',
        '@emotion/react',
        '@emotion/styled'
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
