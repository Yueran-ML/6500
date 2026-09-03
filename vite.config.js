import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves a project site at https://<user>.github.io/<repo>/,
// so the built asset URLs need "/<repo>/" as their base. GitHub Actions
// exposes GITHUB_REPOSITORY as "owner/repo"; we derive the base from it so the
// repo can be renamed without touching this file. Locally, and for a
// user/organisation site (a repo named <user>.github.io), the base is "/".
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSite = repo?.endsWith('.github.io');

export default defineConfig({
  plugins: [react()],
  base: repo && !isUserSite ? `/${repo}/` : '/',
  server: {
    // Honour a PORT set by the environment (preview tooling, containers); fall back to Vite's default.
    port: Number(process.env.PORT) || 5173,
    strictPort: Boolean(process.env.PORT),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
