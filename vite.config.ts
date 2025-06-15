
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'invitation-templates': [
            './src/components/invitation-templates/ModernTemplate.tsx',
            './src/components/invitation-templates/ElegantTemplate.tsx',
            './src/components/invitation-templates/FestiveTemplate.tsx',
            './src/components/invitation-templates/CorporateTemplate.tsx',
            './src/components/invitation-templates/MinimalistTemplate.tsx',
            './src/components/invitation-templates/TemplateRenderer.tsx',
          ],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
}));
