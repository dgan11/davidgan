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