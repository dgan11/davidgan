// Usage: node scripts/spotify-refresh-token-ui.mjs

import http from 'node:http';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';

const HOST = '127.0.0.1';
const PORT = 8888;
const REDIRECT_URI = `http://${HOST}:${PORT}/callback`;
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
].join(' ');

/** @type {Map<string, { clientId: string, clientSecret: string }>} */
const pendingAuth = new Map();

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      max-width: 36rem;
      margin: 2rem auto;
      padding: 0 1rem;
      line-height: 1.5;
      color: #111;
    }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    label { display: block; font-weight: 600; margin-top: 1rem; font-size: 0.875rem; }
    input[type="text"], input[type="password"] {
      width: 100%;
      padding: 0.5rem 0.65rem;
      margin-top: 0.35rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }
    button, .btn {
      margin-top: 1.25rem;
      padding: 0.55rem 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      background: #1db954;
      color: #fff;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #1ed760; }
    .muted { color: #555; font-size: 0.9rem; }
    .token-wrap {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #f4f4f4;
      border-radius: 6px;
      word-break: break-all;
      font-family ui-monospace, monospace;
      font-size: 0.8rem;
    }
    .error { color: #b00020; }
    code { font-size: 0.85em; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function homePage(errorMessage) {
  const err = errorMessage
    ? `<p class="error">${escapeHtml(errorMessage)}</p>`
    : '';
  return page(
    'Spotify refresh token',
    `<h1>Spotify refresh token</h1>
<p class="muted">Credentials stay in memory only — nothing is written to disk.</p>
${err}
<form method="POST" action="/authorize">
  <label for="client_id">Client ID</label>
  <input id="client_id" name="client_id" type="text" required autocomplete="off" />
  <label for="client_secret">Client Secret</label>
  <input id="client_secret" name="client_secret" type="password" required autocomplete="off" />
  <button type="submit">Authorize with Spotify</button>
</form>
<p class="muted">Redirect URI in your Spotify app must be exactly <code>${escapeHtml(REDIRECT_URI)}</code> (use <code>127.0.0.1</code>, not <code>localhost</code>).</p>`
  );
}

function successPage(refreshToken) {
  const safeToken = escapeHtml(refreshToken);
  return page(
    'Refresh token',
    `<h1>Refresh token</h1>
<p class="muted">Copy this into Vercel as <code>SPOTIFY_REFRESH_TOKEN</code>. This page is not saved anywhere.</p>
<div class="token-wrap" id="token">${safeToken}</div>
<button type="button" class="btn" id="copy">Copy refresh token</button>
<p class="muted">You can close this tab and stop the script (Ctrl+C in the terminal).</p>
<script>
document.getElementById('copy').addEventListener('click', async () => {
  const text = document.getElementById('token').textContent;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById('copy').textContent = 'Copied!';
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    document.getElementById('copy').textContent = 'Copied!';
  }
});
</script>`
  );
}

function readFormBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseUrlEncoded(body) {
  const params = new URLSearchParams(body);
  return {
    clientId: params.get('client_id')?.trim() ?? '',
    clientSecret: params.get('client_secret')?.trim() ?? '',
  };
}

async function exchangeCodeForTokens(code, clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data.error_description || data.error || response.statusText;
    throw new Error(msg);
  }

  if (!data.refresh_token) {
    throw new Error('Spotify did not return a refresh token. Try authorizing again.');
  }

  return data.refresh_token;
}

function sendHtml(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function openBrowser(url) {
  if (process.platform !== 'darwin') {
    return;
  }
  exec(`open ${JSON.stringify(url)}`, (err) => {
    if (err) {
      console.warn('Could not open browser:', err.message);
    }
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);

  try {
    if (req.method === 'GET' && url.pathname === '/') {
      sendHtml(res, 200, homePage());
      return;
    }

    if (req.method === 'POST' && url.pathname === '/authorize') {
      const raw = await readFormBody(req);
      const { clientId, clientSecret } = parseUrlEncoded(raw);

      if (!clientId || !clientSecret) {
        sendHtml(res, 400, homePage('Client ID and Client Secret are required.'));
        return;
      }

      const state = crypto.randomBytes(16).toString('hex');
      pendingAuth.set(state, { clientId, clientSecret });

      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('scope', SCOPES);
      authUrl.searchParams.set('state', state);

      res.writeHead(302, { Location: authUrl.toString() });
      res.end();
      return;
    }

    if (req.method === 'GET' && url.pathname === '/callback') {
      const error = url.searchParams.get('error');
      if (error) {
        sendHtml(
          res,
          400,
          homePage(`Spotify authorization failed: ${error}`)
        );
        return;
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state) {
        sendHtml(res, 400, homePage('Missing authorization code or state.'));
        return;
      }

      const session = pendingAuth.get(state);
      pendingAuth.delete(state);

      if (!session) {
        sendHtml(
          res,
          400,
          homePage('Session expired or invalid. Start again from the home page.')
        );
        return;
      }

      const refreshToken = await exchangeCodeForTokens(
        code,
        session.clientId,
        session.clientSecret
      );

      sendHtml(res, 200, successPage(refreshToken));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    sendHtml(res, 500, homePage(message));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use on ${HOST}. Stop the other process or change PORT in this script.`
    );
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}/`;
  console.log(`Spotify refresh token UI: ${url}`);
  console.log(`Redirect URI (Spotify Dashboard): ${REDIRECT_URI}`);
  openBrowser(url);
});
