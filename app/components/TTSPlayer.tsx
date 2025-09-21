"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

export default function TTSPlayer({ slug, title }: { slug: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const src = useMemo(() => `/api/tts`, [])

  async function handlePlay() {
    try {
      setLoading(true)
      setError(null)
      const a = audioRef.current
      if (!a) return
      // If already playing, pause; if paused with a loaded source, resume
      if (a.src) {
        if (!a.paused) {
          a.pause()
          return
        }
        if (a.paused && a.readyState >= 2) {
          await a.play().catch(() => {})
          return
        }
      }
      // Prefer pre-generated static file if present
      const staticUrl = `/audio/blog/${slug}.mp3`
      const head = await fetch(staticUrl, { method: 'HEAD' })
      if (head.ok) {
        a.src = staticUrl
        await a.play()
        return
      }
      const resp = await fetch(src, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!resp.ok) {
        throw new Error(await resp.text())
      }
      // If served from cache, the API returns the mp3 directly as a blob
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      a.src = url
      await a.play()
    } catch (e: any) {
      setError(e?.message || 'Failed to play audio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePlay}
        disabled={loading}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-neutral-50 disabled:opacity-50"
      >
        {loading ? 'Generating…' : isPlaying ? 'Listening' : 'Listen'}
      </button>
      <audio id="tts-audio-main" ref={audioRef} controls className="w-full max-w-[340px]" />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}


