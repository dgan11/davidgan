import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const ROOT = process.cwd()
const POSTS_DIR = path.join(ROOT, 'app', 'blog', 'posts')
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'blog')

// Load .env.local manually if not provided in environment
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const raw = fs.readFileSync(envPath, 'utf-8')
  raw.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx === -1) return
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  })
}

if (!process.env.SPEECHIFY_API_KEY) {
  loadEnvLocal()
}

const SPEECHIFY_API_KEY = process.env.SPEECHIFY_API_KEY
const VOICE_ID = '38c70d56-1551-4019-af88-96d614837dd7'

if (!SPEECHIFY_API_KEY) {
  console.error('Missing SPEECHIFY_API_KEY in environment')
  process.exit(1)
}

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  if (!match) return { metadata: {}, content: fileContent }
  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata = {}
  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = (valueArr.join(': ') || '').trim()
    value = value.replace(/^["'](.*)["']$/, '$1')
    metadata[key.trim()] = value
  })
  return { metadata, content }
}

function mdxToPlainText(mdx) {
  return mdx
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function synthesizeToFile({ slug, title, content }) {
  const text = `${title}. ${mdxToPlainText(content)}`
  const ssml = `<speak><prosody rate="-4%" pitch="-4%">${text}</prosody></speak>`
  const outPath = path.join(OUT_DIR, `${slug}.mp3`)

  const resp = await fetch('https://api.sws.speechify.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SPEECHIFY_API_KEY}`,
    },
    body: JSON.stringify({
      input: ssml,
      voice_id: VOICE_ID,
      audio_format: 'mp3',
      model: 'simba-english',
      language: 'en-US',
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Speechify failed for ${slug}: ${err}`)
  }

  const data = await resp.json()
  const base64 = data.audio_data
  const buffer = Buffer.from(base64, 'base64')

  await fs.promises.mkdir(OUT_DIR, { recursive: true })
  await fs.promises.writeFile(outPath, buffer)
  return outPath
}

async function main() {
  const files = (await fs.promises.readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx'))
  console.log(`Found ${files.length} post(s). Generating MP3s…`)

  let success = 0
  for (const file of files) {
    const slug = path.basename(file, path.extname(file))
    const raw = await fs.promises.readFile(path.join(POSTS_DIR, file), 'utf-8')
    const { metadata, content } = parseFrontmatter(raw)
    const title = metadata.title || slug

    try {
      const out = await synthesizeToFile({ slug, title, content })
      console.log(`✔ ${slug} -> ${path.relative(ROOT, out)}`)
      success++
    } catch (e) {
      console.error(`✖ ${slug}:`, e.message)
    }
  }
  console.log(`Done. ${success}/${files.length} generated.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


