'use client'

import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import HoloCard from "./HolographicCard"
import ModelViewer from "./ModelViewer"

interface SlideData {
  type: 'card' | 'model';
  imageUrl?: string;
  altText?: string;
  title: string;
  color1?: string;
  color2?: string;
  modelSrc?: string;
}

const slideData: SlideData[] = [
  {
    type: 'card',
    imageUrl: "https://utfs.io/f/28635fd9-9b5b-4874-9f1c-606ef5bbe662-iwevjv.jpeg",
    altText: "PSA 10 First Edition Charizard",
    title: "PSA 10 First Edition Charizard",
    color1: "#FFF2CC",
    color2: "#ddccaa"
  },
  {
    type: 'card',
    imageUrl: "https://dilxwvfkfup17.cloudfront.net/eyJpdiI6Ik5FZzVWL1VpdFNIa2hFNFYzMzNtT3c9PSIsInZhbHVlIjoiNlMrb1NCM2taWnN3L1Bpc3lLTWI3bXlDNkRWcHFYNHBpczV5SmtWYmdXYUdnQnZTYzJxRHV0SmliZXVrZjhqSkoyN2hURTgyVUg3Y3g1Tzd6a1ZKNXc9PSIsIm1hYyI6IjEwOGNmZWM4MGJkYzBiNjNlMGIyMjZjYjM1MGMzNTZhNmNiMzViODRmMTA5NzUwZmUxYmZjN2NiODE5ZTMxNjEiLCJ0YWciOiIifQ==",
    altText: "Jerry Rice Card",
    title: "Jerry Rice Card",
    color1: "#FFF2CC",
    color2: "#ddccaa"
  },
  {
    type: 'card',
    imageUrl: "https://utfs.io/f/0db64e07-de0b-4690-892b-db46a70c9fe9-iz4r1n.png",
    altText: "Lebron James Rookie",
    title: "Lebron James Rookie",
    color1: "#FFF2CC",
    color2: "#ddccaa"
  },
  {
    type: 'model',
    title: "3D Model",
    modelSrc: "https://arweave.net/i0EFrNItzgs-w4zHLuhh7opxNlh-1BuaKvYopHmYRe8"
  },
]

export default function MixedMediaSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    setIsDragging(true)
    setStartX(e.pageX - scrollElement.offsetLeft)
    setScrollLeft(scrollElement.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    if ((e.target as HTMLElement).closest('.model-viewer-container')) {
      return
    }

    const scrollElement = scrollRef.current
    if (!scrollElement) return

    e.preventDefault()
    const x = e.pageX - scrollElement.offsetLeft
    const walk = (x - startX) * 2
    scrollElement.scrollLeft = scrollLeft - walk
  }

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setIsAtStart(scrollLeft === 0)
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
    }
  }

  React.useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      checkScrollPosition()
      scrollElement.addEventListener('scroll', checkScrollPosition)
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])

  return (
    <div className="w-full max-w-sm -mt-1 pb-4">
      <div
        className="relative overflow-x-hidden overflow-y-visible cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={scrollRef}
          className="flex items-start gap-3 overflow-x-auto snap-x snap-mandatory pt-1 pb-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {slideData.map((slide, index) => (
            <div key={index} className="flex-shrink-0 snap-start">
              {slide.type === 'card' && slide.imageUrl && (
                <HoloCard
                  imageUrl={slide.imageUrl}
                  altText={slide.altText || ''}
                  color1={slide.color1 || ''}
                  color2={slide.color2 || ''}
                  isLarger={false}
                  priority={index < 2}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              )}
              {slide.type === 'model' && slide.modelSrc && (
                <div className="w-[180px] h-[240px] model-viewer-container rounded-lg overflow-hidden bg-[#e8e6e0]">
                  <ModelViewer src={slide.modelSrc} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <Button
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
          }}
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-[#888] hover:text-[#111] hover:bg-[#eae6e0]"
          disabled={isAtStart}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
          }}
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-[#888] hover:text-[#111] hover:bg-[#eae6e0]"
          disabled={isAtEnd}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
