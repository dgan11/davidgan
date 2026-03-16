import { NextRequest } from 'next/server'
import { getBlogPosts } from 'app/blog/utils'
import {
  buildSpeechifySsml,
  mdxToPlainText,
  SPEECHIFY_API_URL,
  SPEECHIFY_VOICE_ID,
} from 'app/lib/tts-shared.mjs'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  // Return speech marks JSON if it exists
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }
  try {
    const cacheDir = path.join(process.cwd(), 'public', 'audio', 'blog')
    const marksPath = path.join(cacheDir, `${slug}.marks.json`)
    if (!fs.existsSync(marksPath)) {
      return new Response('Marks not found', { status: 404 })
    }
    const json = await fs.promises.readFile(marksPath, 'utf-8')
    return new Response(json, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (e: any) {
    return new Response(`Marks error: ${e?.message || 'unknown'}`, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.SPEECHIFY_API_KEY
    if (!apiKey) {
      return new Response('Missing SPEECHIFY_API_KEY', { status: 500 })
    }

    const { slug } = await req.json()
    if (!slug) {
      return new Response('Missing slug', { status: 400 })
    }

    const post = getBlogPosts().find((p) => p.slug === slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const text = `${post.metadata.title}. ${mdxToPlainText(post.content)}`

    // Build content-based cache key so audio regenerates only when content changes
    const hash = crypto.createHash('sha1').update(text).digest('hex').slice(0, 10)
    const cacheDir = path.join(process.cwd(), 'public', 'audio', 'blog')
    const hashedName = `${post.slug}-${hash}.mp3`
    const hashedPath = path.join(cacheDir, hashedName)
    const stableName = `${post.slug}.mp3`
    const stablePath = path.join(cacheDir, stableName)

    // Serve from cache if exists
    // Prefer stable pre-generated file
    if (fs.existsSync(stablePath)) {
      const buffer = await fs.promises.readFile(stablePath)
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Or a previously cached hashed file
    if (fs.existsSync(hashedPath)) {
      const buffer = await fs.promises.readFile(hashedPath)
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Use SSML to set pitch and rate to ~-4%
    const ssml = buildSpeechifySsml(text)

    const resp = await fetch(SPEECHIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: ssml,
        voice_id: SPEECHIFY_VOICE_ID,
        audio_format: 'mp3',
        model: 'simba-english',
        language: 'en-US',
        options: { speech_marks: true },
      }),
    })

    if (!resp.ok) {
      const errTxt = await resp.text()
      return new Response(`Speechify error: ${errTxt}`, { status: 502 })
    }

    const data = await resp.json()
    const base64 = data.audio_data as string
    if (!base64) {
      return new Response('No audio_data returned', { status: 502 })
    }

    const buffer = Buffer.from(base64, 'base64')

    // Ensure cache dir and write file
    await fs.promises.mkdir(cacheDir, { recursive: true })
    await fs.promises.writeFile(hashedPath, new Uint8Array(buffer))
    // Also write/update stable name for direct serving
    await fs.promises.writeFile(stablePath, new Uint8Array(buffer))

    // Persist speech marks if available
    try {
      const marks = data.speech_marks?.chunks || data.speech_marks || null
      if (marks) {
        const marksPath = path.join(cacheDir, `${post.slug}.marks.json`)
        await fs.promises.writeFile(marksPath, JSON.stringify(marks))
      }
    } catch (error) {
      console.error('Failed to persist speech marks', error)
    }

    // Optionally, clean old cached files for this slug
    try {
      const files = await fs.promises.readdir(cacheDir)
      await Promise.all(
        files
          .filter((f) => f.startsWith(`${post.slug}-`) && f !== hashedName)
          .map((f) => fs.promises.unlink(path.join(cacheDir, f)))
      )
    } catch (error) {
      console.error('Failed to clean old cached TTS files', error)
    }

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e: any) {
    return new Response(`TTS error: ${e?.message || 'unknown'}`, { status: 500 })
  }
}


