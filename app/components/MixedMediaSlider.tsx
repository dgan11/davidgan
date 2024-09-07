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
    // Check if the click originated from a ModelViewer
    // if ((e.target as HTMLElement).closest('.model-viewer-container')) {
    //   return; // Do nothing if clicked on ModelViewer
    // }
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current!.offsetLeft)
    setScrollLeft(scrollRef.current!.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    // Check if the mouse is over a ModelViewer
    if ((e.target as HTMLElement).closest('.model-viewer-container')) {
      return; // Do nothing if over ModelViewer
    }
    e.preventDefault()
    const x = e.pageX - scrollRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll-fast
    scrollRef.current!.scrollLeft = scrollLeft - walk
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
    <div className="w-full max-w-xl mx-auto p-2 md:p-4 relative font-mono">
      {/* <div className="mb-4">
        <h1 className="text-2xl font-bold">Altan Insights</h1>
        <p className="text-lg text-muted-foreground">Worked on this</p>
      </div> */}
      <div 
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {slideData.map((slide, index) => (
            <div key={index} className="flex-shrink-0 scroll-snap-align-start pb-12">
              {slide.type === 'card' && slide.imageUrl && (
                <HoloCard
                  imageUrl={slide.imageUrl}
                  altText={slide.altText || ''}
                  color1={slide.color1 || ''}
                  color2={slide.color2 || ''}
                  isLarger={true}
                />
              )}
              {slide.type === 'model' && slide.modelSrc && (
                <div className="w-[300px] h-[400px] model-viewer-container">
                  <ModelViewer src={slide.modelSrc} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={() => {
          const scrollAmount = window.innerWidth <= 599 ? -380 : -300;
          scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }}
        variant="ghost"
        size="sm"
        className="absolute bottom-4 mleft-4 z-10 bg-gray-200 bg-opacity-30 hover:bg-opacity-70 transition-opacity"
        disabled={isAtStart}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>
      <Button
        onClick={() => {
          const scrollAmount = window.innerWidth <= 599 ? 380 : 300;
          scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }}
        variant="ghost"
        size="sm"
        className="absolute bottom-4 right-2 md:right-4 z-10 bg-gray-200 bg-opacity-30 hover:bg-opacity-70 transition-opacity"
        disabled={isAtEnd}
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  )
}
