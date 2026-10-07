# Service Request Client

1. Start the API as described in `../server/SETUP.md`.
2. In `client/`, run `npm install` and `npm run dev`.
3. Open `http://localhost:5173`.

Vite proxies `/api` to `http://localhost:4000`. The login page serves both roles. Employees may self-register; admins sign in with the account created by the server seed command.

Run `npm run build` for the TypeScript and production bundle checks.
