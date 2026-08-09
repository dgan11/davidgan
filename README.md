### davidgan.com

personal website

## Blog TTS + word highlighting

Generate audio and timestamps for posts and enable inline word highlighting synced to playback.

### 1) Author a post
- Add an MDX file to `app/blog/posts/`. The filename is the slug.

### 2) Pre-generate audio + marks (recommended)
1. Create `.env.local` with your Speechify key:
```
SPEECHIFY_API_KEY=YOUR_KEY
```
2. Run:
```
npm run tts:gen
```
This creates:
- `public/audio/blog/<slug>.mp3`
- `public/audio/blog/<slug>.marks.json` (timestamps; usually in ms)

### 3) Manual fixes (optional)
- Create/edit `public/audio/blog/<slug>.marks.override.json` to override timings. The app will prefer the override file.
- Example (ms):
```
[{"type":"word","start_time":0,"end_time":1066,"value":"Importance"}, ...]
```

### 4) On-demand generation (fallback)
- Visiting a post and clicking “Listen” will auto-generate audio/marks if they don’t exist and save them to `public/audio/blog/`.

### 5) Player + Highlighter
- The post page renders an audio player and a `WordHighlighter` that wraps the title + article words and highlights the current word.
- Config (in `app/blog/[slug]/page.tsx`):
```tsx
<WordHighlighter
  slug={post.slug}
  preferMarks={true}
  markUnit="ms"    // 'auto' | 'ms' | 's'
  offsetSec={0}     // shift highlight relative to audio
  pace={1.15}       // >1 slows highlight vs audio (fallback only)
  includeTitle={true}
/>
```

Notes
- Marks lookup order: `<slug>.marks.override.json` → `<slug>.marks.json` → API → average-duration fallback.
- Title is included in word wrapping; set `includeTitle={false}` to exclude.

## Spotify listening card (refresh token)

The homepage shows a Spotify “what am I listening to” card (currently playing or recently played). It uses server-side API calls with a long-lived refresh token stored in Vercel environment variables:

- `SPOTIFY_REFRESH_TOKEN`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

Spotify refresh tokens expire after **180 days**. Refreshing access tokens in production does **not** extend that deadline ([policy effective July 20, 2026](https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration)). When the refresh token expires, the card stops working until you complete browser authorization again and update Vercel.

### Renew the refresh token (~every 180 days)

1. In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), open the app used for this site (e.g. **what am i listening to component**).
2. Under **Redirect URIs**, add exactly: `http://127.0.0.1:8888/callback`  
   Use `127.0.0.1`, not `localhost` — Spotify treats them as different URIs.
3. Locally, run:
   ```
   npm run spotify:token
   ```
   or:
   ```
   node scripts/spotify-refresh-token-ui.mjs
   ```
4. Enter **Client ID** and **Client Secret** in the browser form (nothing is written to disk). Approve Spotify access.
5. Copy the **refresh token** from the success page.
6. In Vercel → Project → Settings → Environment Variables, update `SPOTIFY_REFRESH_TOKEN` for **Production** (and Preview if you use it). Redeploy so the new value is picked up.

Optional: set a calendar reminder at about **5 months** so you renew before the 180-day expiry.

References: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) · [Refresh token expiration](https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration)