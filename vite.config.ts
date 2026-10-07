import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const tunnelHost = loadEnv(mode, '.', '').CLOUDFLARE_TUNNEL_HOST?.trim()
    || 'reuters-careers-necessity-sir.trycloudflare.com';

  return {
    plugins: [react()],
    server: {
      allowedHosts: [tunnelHost],
      proxy: { '/api': 'http://localhost:4000' },
    },
  };
});
