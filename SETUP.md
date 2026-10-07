# Service Request Client

1. Start the API as described in `../server/SETUP.md`.
2. In `client/`, run `npm install` and `npm run dev`.
3. Open `http://localhost:5173`.

Vite proxies `/api` to `http://localhost:4000`. The login page serves both roles. Employees may self-register; admins sign in with the account created by the server seed command.

For a Cloudflare Quick Tunnel, keep both the API (`localhost:4000`) and Vite (`localhost:5173`) running, then tunnel the Vite port: `cloudflared tunnel --url http://localhost:5173`. Vite forwards `/api` calls to the local API, so no second tunnel or browser-side API URL is needed. The current tunnel hostname is allowed in `vite.config.ts`. When Cloudflare assigns a new hostname, set `CLOUDFLARE_TUNNEL_HOST` to that hostname (without `https://`) before starting Vite. In PowerShell: `$env:CLOUDFLARE_TUNNEL_HOST = 'new-host.trycloudflare.com'; npm run dev`.

Run `npm run build` for the TypeScript and production bundle checks.
