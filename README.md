# Perry — Fund Independence (Animation)

Static explainer video for Perry. No build step required.

## Local preview

Must be served over HTTP (JSX is loaded via `fetch`):

```bash
python3 -m http.server 8765
```

Open [http://localhost:8765/](http://localhost:8765/)

**Controls:** Space = play/pause · ← → = seek · `0` = restart

## Deploy publicly

### Option A — Netlify Drop (fastest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. Share the generated `*.netlify.app` URL

### Option B — Vercel

1. Push this folder to a GitHub repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Leave **Build Command** empty and **Output Directory** as `.` (root)
4. Deploy — your site will be live at `https://<project>.vercel.app`

### Option C — Cloudflare Pages

1. Push to GitHub
2. Create a Pages project → connect the repo
3. Build command: *(none)* · Build output directory: `/`

### Custom domain

Add your domain (e.g. `video.useperry.com`) in the hosting dashboard and follow the DNS instructions.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Entry page |
| `PerryVideo.jsx` | Video scenes & playback |
| `support.js` | dc-runtime (loads React + Babel from CDN) |
| `animations.jsx` | Reusable animation scaffold (optional) |
| `PerryVideo_navy_v1.jsx` | Alternate cut (not linked from `index.html`) |
