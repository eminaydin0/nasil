import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { localApiPlugin } from './vite-plugin-local-api.mjs';

dotenv.config();

function googleSiteVerificationPlugin() {
  const code = (process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim();
  return {
    name: 'google-site-verification',
    transformIndexHtml(html) {
      if (!code) return html;
      if (html.includes('google-site-verification')) return html;
      return html.replace(
        '</head>',
        `    <meta name="google-site-verification" content="${code}" />\n  </head>`
      );
    },
  };
}

function lcpPreloadPlugin() {
  return {
    name: 'lcp-preload',
    transformIndexHtml(html) {
      if (html.includes('rel="preload" as="image"')) return html;
      let href = '';
      try {
        const src = fs.readFileSync(new URL('./src/constants/lcpHero.js', import.meta.url), 'utf8');
        href = src.match(/LCP_HERO_IMAGE\s*=\s*'([^']+)'/)?.[1] || '';
      } catch {
        href = '';
      }
      if (!href) return html;
      return html.replace(
        '</head>',
        `    <link rel="preload" as="image" href="${href}" fetchpriority="high" />\n  </head>`
      );
    },
  };
}

/** Giriş CSS dosyasını HTML içine alır; ilk çizimi ayrı bir engelleyici istek beklemez. */
function inlineEntryCssPlugin() {
  return {
    name: 'inline-entry-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const htmlKey = Object.keys(bundle).find((name) => name.endsWith('index.html'));
      const htmlAsset = htmlKey ? bundle[htmlKey] : null;
      if (!htmlAsset || typeof htmlAsset.source !== 'string') return;

      let html = htmlAsset.source;
      const linkRe = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
      const used = new Set();
      html = html.replace(linkRe, (tag, href) => {
        const key = href.replace(/^\//, '');
        const cssAsset = bundle[key];
        if (!cssAsset) return tag;
        const css = (typeof cssAsset.source === 'string' ? cssAsset.source : cssAsset.source?.toString?.() || '').replace(
          /<\/style/gi,
          '<\\/style'
        );
        used.add(key);
        return `<style>${css}</style>`;
      });
      htmlAsset.source = html;
      for (const key of used) delete bundle[key];
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin(), googleSiteVerificationPlugin(), lcpPreloadPlugin(), inlineEntryCssPlugin()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast', 'react-helmet-async'],
        },
      },
    },
  },
  server: {
    port: 3060,
    strictPort: true,
    host: true,
    hmr: {
      host: 'localhost',
      port: 3060,
      clientPort: 3060,
    },
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
});
