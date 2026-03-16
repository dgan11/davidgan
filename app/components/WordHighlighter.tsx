"use client"
import { useEffect } from 'react'

type SpeechMark = {
  start_time: number
}

function getMarksScale(marks: SpeechMark[], markUnit: 'auto' | 'ms' | 's') {
  if (markUnit === 'ms') return 0.001
  if (markUnit === 's') return 1

  const maxStart = Math.max(...marks.map((mark) => mark.start_time || 0))
  return maxStart > 120 ? 0.001 : 1
}

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
    const audioEl = document.getElementById('tts-audio-main') as HTMLAudioElement | null
    const selector = includeTitle ? '.title, article' : 'article'
    const containers = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!audioEl || containers.length === 0) return

    const allTextNodes: Text[] = []
    containers.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        const t = node as Text
        if (!t.nodeValue?.trim()) continue
        if (t.parentElement?.closest('.tts-word')) continue
        allTextNodes.push(t)
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

    const avg = () => ((audioEl.duration || 1) / wordsEls.length) * pace

    let raf = 0
    let activeIndex = -1
    let isDisposed = false
    const cleanupFns: Array<() => void> = []

    const clearActiveWord = () => {
      if (activeIndex >= 0) {
        wordsEls[activeIndex]?.classList.remove('tts-word-active')
        activeIndex = -1
      }
    }

    const setActiveWord = (nextIndex: number) => {
      if (nextIndex === activeIndex) return

      if (activeIndex >= 0) {
        wordsEls[activeIndex]?.classList.remove('tts-word-active')
      }

      wordsEls[nextIndex]?.classList.add('tts-word-active')
      activeIndex = nextIndex
    }

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

    const attachClickHandlers = (getTimeForIndex: (index: number) => number) => {
      const removers = wordsEls.map((wordEl, index) => {
        const handleClick = () => {
          audioEl.currentTime = Math.max(0, getTimeForIndex(index))

          if (audioEl.paused) {
            clearActiveWord()
            return
          }

          audioEl.play().catch(() => {})
        }

        wordEl.addEventListener('click', handleClick)
        return () => wordEl.removeEventListener('click', handleClick)
      })

      return () => removers.forEach((remove) => remove())
    }

    const startTicker = (getIndexForTime: (time: number) => number) => {
      const tick = () => {
        const time = Math.max(0, audioEl.currentTime + offsetSec)
        setActiveWord(getIndexForTime(time))
        raf = requestAnimationFrame(tick)
      }

      const onPlay = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      }

      const onPause = () => cancelAnimationFrame(raf)

      const onSeeked = () => {
        if (!audioEl.paused) {
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

    function startWithMarks(marks: SpeechMark[]) {
      const scale = getMarksScale(marks, markUnit)
      const markTimes = marks.map((mark) => (mark.start_time || 0) * scale)

      cleanupFns.push(
        attachClickHandlers((index) => (markTimes[Math.min(index, markTimes.length - 1)] || 0) - 0.05),
        startTicker((time) => {
          let pointer = 0

          while (pointer + 1 < markTimes.length && markTimes[pointer + 1] <= time) {
            pointer++
          }

          return Math.min(pointer, wordsEls.length - 1)
        })
      )
    }

    function startWithAverage() {
      cleanupFns.push(
        attachClickHandlers((index) => index * avg()),
        startTicker((time) => Math.min(wordsEls.length - 1, Math.floor(time / avg())))
      )
    }

    async function initializeHighlighting() {
      if (!preferMarks) {
        startWithAverage()
        return
      }

      try {
        const marks = await loadMarks()
        if (isDisposed) return

        if (marks?.length) {
          startWithMarks(marks)
          return
        }

        startWithAverage()
      } catch {
        if (!isDisposed) {
          startWithAverage()
        }
      }
    }

    initializeHighlighting()

    return () => {
      isDisposed = true
      cancelAnimationFrame(raf)
      clearActiveWord()
      cleanupFns.reverse().forEach((cleanup) => cleanup())
    }
  }, [slug, pace, offsetSec, includeTitle, preferMarks, markUnit])

  return null
}


