
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
    minify: 'esbuild', // Changed from 'terser' to 'esbuild'
    chunkSizeWarningLimit: 1000,
    // Optimize build for production
    target: 'esnext',
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
          'vendor': ['react', 'react-dom'],
          'ui': [
            './src/components/ui/button.tsx',
            './src/components/ui/card.tsx',
            './src/components/ui/input.tsx',
            './src/components/ui/toast.tsx',
          ],
        },
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'qrcode.react',
    ],
  },
}));
