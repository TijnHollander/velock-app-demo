# VELOCK App Demo

Mobile app prototype for the VELOCK concept — secure urban bike docking
for Cologne.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel

1. Push this folder to a GitHub repo (e.g. `velock-app-demo`).
2. On Vercel, click **Add New… → Project** and import the repo.
3. **Important:** under **Framework Preset**, select **Vite**
   (not Create React App).
4. Leave Root Directory as `./` and Build Command / Output Directory
   on their defaults (`npm run build` / `dist`).
5. Click **Deploy**.

That's it — Vercel handles the rest.
