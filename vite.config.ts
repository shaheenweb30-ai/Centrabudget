import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // Commented out to avoid CSP issues

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Add CSP headers for development - more permissive for dev, strict for production
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self';"
        : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self';"
    }
  },
  plugins: [
    react(),
    // Only include lovable-tagger in development mode and with proper CSP handling
    // mode === 'development' && componentTagger(), // Disabled to avoid CSP issues
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build optimizations to avoid eval-like functions
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  // Ensure proper CSP compliance
  define: {
    __DEV__: mode === 'development',
  },
  // Disable HMR if it causes CSP issues
  hmr: mode === 'development' ? {
    overlay: false,
  } : false,
  // Optimize for CSP compliance
  optimizeDeps: {
    exclude: ['lovable-tagger'],
  },
}));
