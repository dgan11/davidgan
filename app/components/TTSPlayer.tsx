"use client"
import { useEffect, useRef, useState } from 'react'

export default function TTSPlayer({ slug }: { slug: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  const loadAudioSource = async () => {
    const staticUrl = `/audio/blog/${slug}.mp3`
    const head = await fetch(staticUrl, { method: 'HEAD' })

    if (head.ok) {
      revokeObjectUrl()
      return staticUrl
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const blob = await response.blob()
    revokeObjectUrl()
    objectUrlRef.current = URL.createObjectURL(blob)
    return objectUrlRef.current
  }

  async function handlePlay() {
    const audio = audioRef.current
    if (!audio) return

    try {
      setLoading(true)
      setError(null)

      if (audio.currentSrc) {
        if (!audio.paused) {
          audio.pause()
          return
        }

        if (audio.readyState >= 2) {
          await audio.play()
          return
        }
      }

      audio.src = await loadAudioSource()
      await audio.play()
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
      revokeObjectUrl()
    }
  }, [slug])

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePlay}
        disabled={loading}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-neutral-50 disabled:opacity-50"
      >
        {loading ? 'Generating…' : isPlaying ? 'Listening' : 'Listen'}
      </button>
      <audio
        id="tts-audio-main"
        data-tts-audio="true"
        ref={audioRef}
        controls
        className="w-full max-w-[340px]"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}


