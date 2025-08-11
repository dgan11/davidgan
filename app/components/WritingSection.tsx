"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WritingItem {
  id: string;
  title: string;
  imageUrl: string;
  textContent: string;
}

const writings: WritingItem[] = [
  {
    id: "thoughts-on-x",
    title: "Thoughts on X",
    imageUrl:
      "https://cdn.sanity.io/images/h20inf57/production/1adea26059beed3e261ee3d158b5bd21d5783841-824x1024.jpg?w=2506&auto=format",
    textContent: `# Thoughts on X

I've been reflecting on the nature of social platforms and how they shape our interactions. There's something profound about the way digital spaces influence human behavior.

## The Question of Authenticity

Who doesn't want a Saab 900 Turbo? The question itself reveals something about desire and aspiration. We project ourselves into objects, into brands, into experiences that feel authentic to who we want to be.

## Connection in Digital Spaces

In a world of endless scrolling and algorithmic feeds, genuine connection becomes increasingly rare. The handwritten word carries weight that pixels cannot match.

*These thoughts emerged during a quiet morning, pen in hand, paper before me - a meditation on what it means to think slowly in a fast world.*`,
  },
  {
    id: "meditations-on-y",
    title: "Meditations on Y",
    imageUrl:
      "https://cdn.sanity.io/images/h20inf57/production/b4faef6cc4b56eaad9c9b693373c54d42acfb8fd-785x1024.jpg?w=2506&auto=format",
    textContent: `# Meditations on Y

Beverly Wilshire Hotel - a place where dreams and reality intersect. I find myself thinking about the spaces we inhabit and how they shape our inner landscapes.

## The Luxury of Time

Sitting in elegant surroundings, I'm reminded that true luxury isn't in the thread count of sheets or the marble of floors. It's in the freedom to think, to reflect, to let thoughts wander without purpose or deadline.

## On Presence

The act of writing by hand forces presence. Each letter is deliberate, each word chosen with care. There's no delete key in ink - only the courage to continue forward.

## California Dreaming

There's something about California light that makes everything feel possible. Perhaps it's the way it falls across pages, illuminating thoughts that were hidden in shadow.

*Written in a moment of quiet contemplation, watching the world move at its own pace while I moved at mine.*`,
  },
  {
    id: "travel-blog",
    title: "Travel Blog",
    imageUrl:
      "https://cdn.sanity.io/images/h20inf57/production/63998ee320085a18568a90b97606be3d8aa9807f-719x1024.jpg?w=1820&auto=format",
    textContent: `# Travel Blog: The Ritz-Carlton

Today I found myself in one of those moments that travel writers dream about - sitting in a grand hotel, watching the world through floor-to-ceiling windows, pen moving across paper.

## The Art of Observation

Travel isn't just about destinations; it's about learning to see. The way light hits unfamiliar architecture, the rhythm of conversations in languages you don't speak, the small rituals that make a place feel alive.

## Notes from the Road

- The concierge's smile that says "welcome" in any language
- Coffee that tastes different at 30,000 feet
- The universal language of hotel key cards and elevator buttons
- How "home" becomes relative when you're always moving

## Reflections on Luxury

True luxury in travel isn't thread count or champagne service. It's the luxury of time to think, space to breathe, and the perspective that only distance from the familiar can provide.

## The Paradox of Connection

The further I travel from home, the more connected I feel to what matters. Distance creates clarity.

*These thoughts captured between flights, between destinations, between the person I was when I left and the person I'm becoming through the act of moving through the world.*`,
  },
  {
    id: "apple-computer-1",
    title: "Apple Computer 1",
    imageUrl:
      "https://i.pcmag.com/imagery/articles/04NCHMpC3T7JNTxw0b9JWKT-2..v1692985610.jpg",
    textContent: `# Apple Computer 1: A Revolution in Wood and Silicon

Looking at the Apple-1 computer today, it's hard to imagine that this wooden board with exposed circuits would spark a technological revolution that changed the world.

## The Beauty of Simplicity

Steve Wozniak's genius wasn't in complexity - it was in elegance. Every component on this board served a purpose. No wasted space, no unnecessary flourishes. Just pure functional design.

## The Garage Myth and Reality

While the "garage startup" story has become Silicon Valley lore, the real magic happened in the minds of two young men who saw personal computing not as a business opportunity, but as a democratizing force.

## Handcrafted Technology

Each Apple-1 was essentially handmade. The wooden case, the careful soldering, the personal touch of creators who believed they were building something meaningful, not just profitable.

## From Hobbyist to Mainstream

What started as a computer for electronics enthusiasts became the foundation for bringing computing power to everyone. The Apple-1 didn't just process data - it processed dreams.

## The Long View

Today, as we carry more computing power in our pockets than existed in entire buildings in 1976, it's worth remembering that revolution often starts with someone willing to imagine a different future.

*Reflecting on how the most important innovations often look deceptively simple in retrospect.*`,
  },
];

export default function WritingSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"image" | "text">("image");

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    if (selectedId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedId]);

  // Reset view mode when modal closes
  useEffect(() => {
    if (!selectedId) {
      setViewMode("image");
    }
  }, [selectedId]);

  // Simple markdown renderer for text content
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900">
            {line.slice(2)}
          </h1>,
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={index}
            className="text-xl font-semibold mb-4 mt-6 text-gray-800"
          >
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={index} className="text-gray-700 mb-1 ml-4">
            {line.slice(2)}
          </li>,
        );
      } else if (
        line.startsWith("*") &&
        line.endsWith("*") &&
        line.length > 2
      ) {
        elements.push(
          <p key={index} className="text-gray-600 italic mb-4">
            {line.slice(1, -1)}
          </p>,
        );
      } else if (line.trim() === "") {
        elements.push(<div key={index} className="mb-2"></div>);
      } else {
        elements.push(
          <p key={index} className="text-gray-800 mb-4 leading-relaxed">
            {line}
          </p>,
        );
      }
    });

    return elements;
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2 w-full">
        {writings.map((writing) => (
          <motion.div
            key={writing.id}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            initial={{ height: 60 }}
            animate={{
              height: hoveredId === writing.id ? 300 : 60,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            onMouseEnter={() => setHoveredId(writing.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(writing.id)}
          >
            {/* Background Image */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.2 }}
              animate={{
                scale: hoveredId === writing.id ? 1 : 1.2,
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Image
                src={writing.imageUrl}
                alt={writing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20" />

            {/* Title - Always visible */}
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 1 }}
              animate={{
                opacity: hoveredId === writing.id ? 0 : 1,
              }}
              transition={{
                duration: 0.3,
                delay: hoveredId === writing.id ? 0 : 0.3,
              }}
            >
              <div className="bg-white bg-opacity-20 backdrop-blur rounded px-2 py-0.5 border border-white border-opacity-30">
                <h4 className="text-white font-medium text-sm whitespace-nowrap drop-shadow-md">
                  {writing.title}
                </h4>
              </div>
            </motion.div>

            {/* Expanded content - Only visible on hover */}
            <AnimatePresence>
              {hoveredId === writing.id && (
                <motion.div
                  className="absolute inset-0 flex items-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.2,
                  }}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="text-white">
                      <h4 className="text-lg font-semibold mb-2">
                        {writing.title}
                      </h4>
                    </div>
                    <div className="flex-1 h-48 relative rounded-md overflow-hidden">
                      <Image
                        src={writing.imageUrl}
                        alt={`Full ${writing.title}`}
                        fill
                        className="object-contain"
                        sizes="250px"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const selectedWriting = writings.find(
                  (w) => w.id === selectedId,
                );
                return selectedWriting ? (
                  <div className="relative w-full h-full">
                    {/* Toggle Buttons */}
                    <div className="absolute top-4 left-4 z-20 flex bg-black bg-opacity-70 rounded-full p-1 backdrop-blur-sm border border-white border-opacity-20">
                      <button
                        onClick={() => setViewMode("image")}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                          viewMode === "image"
                            ? "bg-white text-black"
                            : "text-white hover:bg-white hover:bg-opacity-20"
                        }`}
                      >
                        Image
                      </button>
                      <button
                        onClick={() => setViewMode("text")}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                          viewMode === "text"
                            ? "bg-white text-black"
                            : "text-white hover:bg-white hover:bg-opacity-20"
                        }`}
                      >
                        Text
                      </button>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                      aria-label="Close fullscreen view"
                    >
                      ×
                    </button>

                    {/* Content */}
                    {viewMode === "image" ? (
                      <Image
                        src={selectedWriting.imageUrl}
                        alt={selectedWriting.title}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="max-w-4xl max-h-full w-full bg-orange-50 rounded-lg shadow-2xl overflow-y-auto p-8 border border-orange-100 custom-scrollbar">
                          <div className="max-w-3xl mx-auto pt-12">
                            {renderMarkdown(selectedWriting.textContent)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Title (only show in image mode) */}
                    {viewMode === "image" && (
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-semibold">
                          {selectedWriting.title}
                        </h3>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
