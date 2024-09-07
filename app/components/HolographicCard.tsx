/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import './HolographicCard.css';

interface HoloCardProps {
  imageUrl: string;
  altText: string;
  color1: string;
  color2: string;
  isLarger?: boolean; // New prop
}

const HoloCard: React.FC<HoloCardProps> = ({ imageUrl, altText, color1, color2, isLarger = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (cardRef.current) {
      setCardSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const calculateStyles = () => {
    if (!isHovered) return {};

    const { x, y } = mousePosition;
    const { width, height } = cardSize;

    const px = Math.abs(Math.floor(100 / width * x) - 100);
    const py = Math.abs(Math.floor(100 / height * y) - 100);
    const pa = (50 - px) + (50 - py);

    const lp = (50 + (px - 50) / 1.5);
    const tp = (50 + (py - 50) / 1.5);
    const pxSpark = (50 + (px - 50) / 7);
    const pySpark = (50 + (py - 50) / 7);
    const pOpc = 20 + (Math.abs(pa) * 1.5);
    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * 0.5;

    const gradPos = `${lp}% ${tp}%`;
    const sprkPos = `${pxSpark}% ${pySpark}%`;
    const opc = pOpc / 100;

    return {
      '--gradPos': gradPos,
      '--sprkPos': sprkPos,
      '--opc': opc,
      transform: `rotateX(${ty}deg) rotateY(${tx}deg)`,
    };
  };

  return (
    <div
      ref={cardRef}
      className={`holo-card ${isHovered ? 'hovered' : ''} ${isLarger ? 'larger' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--color1': color1,
        '--color2': color2,
        '--imageUrl': `url(${imageUrl})`,
        ...calculateStyles(),
      } as unknown as React.CSSProperties}
    >
      <img src={imageUrl} alt={altText} className="card-image" />
    </div>
  );
};

export default HoloCard;