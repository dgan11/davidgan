"use client"
import { useEffect } from 'react'

// Deterministic highlighter using average word duration (like your example)
export default function WordHighlighter({
  slug,
  pace = 1.15, // >1 slows highlight
  offsetSec = 0, // positive = lag behind audio; negative = lead
  includeTitle = true,
  preferMarks = true, // if marks JSON exists, use it
  markUnit = 'auto', // 'auto' | 'ms' | 's'
}: {
  slug: string
  pace?: number
  offsetSec?: number
  includeTitle?: boolean
  preferMarks?: boolean
  markUnit?: 'auto' | 'ms' | 's'
}) {
  useEffect(() => {
    const audio = document.querySelector<HTMLAudioElement>('audio')
    // Include title optionally
    const selector = includeTitle ? '.title, article' : 'article'
    const containers = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!audio || containers.length === 0) return

    const audioEl = audio as HTMLAudioElement

    // 1) Wrap words in spans
    const allTextNodes: Text[] = []
    containers.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        const t = node as Text
        if (t.nodeValue && t.nodeValue.trim()) allTextNodes.push(t)
      }
    })

    for (const textNode of allTextNodes) {
      const text = textNode.textContent || ''
      const parts = text.split(/(\s+)/)
      if (parts.length <= 1) continue
      const frag = document.createDocumentFragment()
      for (const part of parts) {
        if (!part) continue
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
        } else {
          const span = document.createElement('span')
          span.textContent = part
          span.className = 'tts-word'
          frag.appendChild(span)
        }
      }
      textNode.parentNode?.replaceChild(frag, textNode)
    }

    const wordsEls = Array.from(document.querySelectorAll<HTMLSpanElement>('.title span.tts-word, article span.tts-word'))
    if (wordsEls.length === 0) return

    // 2) Compute average duration per word (apply pacing)
    const avg = () => ((audioEl.duration || 1) / wordsEls.length) * pace

    let raf = 0

    async function loadMarks() {
      const urls = [
        `/audio/blog/${slug}.marks.override.json`,
        `/audio/blog/${slug}.marks.json`,
        `/api/tts?slug=${encodeURIComponent(slug)}`,
      ]
      for (const url of urls) {
        try {
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data) && data.length) return data
          }
        } catch {}
      }
      return null
    }

    function startWithMarks(marks: Array<{ start_time: number }>) {
      let scale = 1
      if (markUnit === 'ms') scale = 0.001
      else if (markUnit === 's') scale = 1
      else {
        const maxStart = Math.max(...marks.map((m) => m.start_time || 0))
        scale = maxStart > 120 ? 0.001 : 1
      }

      let ptr = 0
      let lastIdx = -1
      const tick = () => {
        const t = Math.max(0, audioEl.currentTime + offsetSec)
        while (ptr + 1 < marks.length && (marks[ptr + 1].start_time || 0) * scale <= t) ptr++
        const idx = Math.min(ptr, wordsEls.length - 1)
        if (idx !== lastIdx) {
          if (lastIdx >= 0) wordsEls[lastIdx].classList.remove('tts-word-active')
          wordsEls[idx]?.classList.add('tts-word-active')
          lastIdx = idx
        }
        raf = requestAnimationFrame(tick)
      }
      const onPlay = () => {
        const t = Math.max(0, audioEl.currentTime + offsetSec)
        ptr = 0
        while (ptr + 1 < marks.length && (marks[ptr + 1].start_time || 0) * scale <= t) ptr++
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      }
      const onPause = () => cancelAnimationFrame(raf)
      const onSeeked = () => {
        if (!audioEl.paused) {
          const t = Math.max(0, audioEl.currentTime + offsetSec)
          ptr = 0
          while (ptr + 1 < marks.length && (marks[ptr + 1].start_time || 0) * scale <= t) ptr++
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(tick)
        }
      }
      audioEl.addEventListener('play', onPlay)
      audioEl.addEventListener('pause', onPause)
      audioEl.addEventListener('ended', onPause)
      audioEl.addEventListener('seeked', onSeeked)
      return () => {
        cancelAnimationFrame(raf)
        audioEl.removeEventListener('play', onPlay)
        audioEl.removeEventListener('pause', onPause)
        audioEl.removeEventListener('ended', onPause)
        audioEl.removeEventListener('seeked', onSeeked)
      }
    }

    function startWithAverage() {
      let last = -1
      const tick = () => {
        const t = Math.max(0, audioEl.currentTime + offsetSec)
        const idx = Math.min(wordsEls.length - 1, Math.floor(t / avg()))
        if (idx !== last) {
          if (last >= 0) wordsEls[last].classList.remove('tts-word-active')
          wordsEls[idx]?.classList.add('tts-word-active')
          last = idx
        }
        raf = requestAnimationFrame(tick)
      }
      const onPlay = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }
      const onPause = () => cancelAnimationFrame(raf)
      const onSeeked = () => { if (!audioEl.paused) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) } }
      audioEl.addEventListener('play', onPlay)
      audioEl.addEventListener('pause', onPause)
      audioEl.addEventListener('ended', onPause)
      audioEl.addEventListener('seeked', onSeeked)
      return () => {
        cancelAnimationFrame(raf)
        audioEl.removeEventListener('play', onPlay)
        audioEl.removeEventListener('pause', onPause)
        audioEl.removeEventListener('ended', onPause)
        audioEl.removeEventListener('seeked', onSeeked)
      }
    }

    // Click handling will be attached below depending on mode (marks vs average)

    let cleanup: (() => void) | undefined
    if (preferMarks) {
      loadMarks().then((m) => {
        if (m) {
          // For marks, seek to exact timestamp for clicked word
          let scale = 1
          if (markUnit === 'ms') scale = 0.001
          else if (markUnit === 's') scale = 1
          else {
            const maxStart = Math.max(...m.map((x: any) => x.start_time || 0))
            scale = maxStart > 120 ? 0.001 : 1
          }
          wordsEls.forEach((w, i) => {
            w.addEventListener('click', () => {
              const idx = Math.min(i, m.length - 1)
              const t = (m[idx].start_time || 0) * scale
              audioEl.currentTime = Math.max(0, t - 0.05) // small lead
              if (audioEl.paused) audioEl.play().catch(() => {})
            })
          })
          cleanup = startWithMarks(m)
        } else {
          // Fallback: average mapping
          wordsEls.forEach((w, i) => {
            w.addEventListener('click', () => {
              audioEl.currentTime = i * avg()
              if (audioEl.paused) audioEl.play().catch(() => {})
            })
          })
          cleanup = startWithAverage()
        }
      }).catch(() => { 
        wordsEls.forEach((w, i) => {
          w.addEventListener('click', () => {
            audioEl.currentTime = i * avg()
            if (audioEl.paused) audioEl.play().catch(() => {})
          })
        })
        cleanup = startWithAverage() 
      })
    } else {
      cleanup = startWithAverage()
    }

    return () => { if (cleanup) cleanup() }
  }, [slug, pace, offsetSec, includeTitle, preferMarks, markUnit])

  return null
}


