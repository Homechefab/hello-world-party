import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  let taggerPlugin: any = null;
  try {
    const mod: any = await import('lovable-tagger');
    taggerPlugin = mod?.componentTagger ? mod.componentTagger() : null;
  } catch {}

  return {
    plugins: [
      react(),
      ...(taggerPlugin ? [taggerPlugin] : [])
    ],
    server: {
      port: 8080
    },
    build: {
      outDir: 'dist-preview',
      target: 'esnext',
      minify: false
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
