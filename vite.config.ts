import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLovable = mode === 'lovable';
  const isDev = mode === 'development';
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      componentTagger(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
      outDir: isLovable ? 'dist-lovable' : 'dist',
      target: 'esnext',
      rollupOptions: isLovable ? undefined : {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  };
});
