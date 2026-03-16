import React, { useEffect, useRef } from 'react';

interface SpinningRecordProps {
  size?: number;
  image?: string;
  isPlaying: boolean;
}

const SpinningRecord: React.FC<SpinningRecordProps> = ({ size = 48, image, isPlaying }) => {
  const recordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const record = recordRef.current;
    if (record) {
      if (isPlaying) {
        record.style.animationPlayState = 'running';
      } else {
        record.style.animationPlayState = 'paused';
      }
    }
  }, [isPlaying]);

  return (
    <div className="record-container" style={{ width: size, height: size }}>
      <div ref={recordRef} className="spinning-record">
        <svg width={size} height={size} viewBox="0 0 48 48">
          <defs>
            <radialGradient id="vinyl" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#141414" />
              <stop offset="40%" stopColor="#1a1a1a" />
              <stop offset="75%" stopColor="#0d0d0d" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            <radialGradient id="vinylEdge" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#060606" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
            <linearGradient id="light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {image && (
              <clipPath id="centerClip">
                <circle cx="24" cy="24" r="14.7" />
              </clipPath>
            )}
          </defs>
          <circle cx="24" cy="24" r="24" fill="url(#vinyl)" />
          <circle cx="24" cy="24" r="24" fill="url(#vinylEdge)" fillOpacity="0.6" />
          <circle cx="24" cy="24" r="15" fill="#0a0a0a" stroke="#111" strokeWidth="0.3" />
          {image ? (
            <image
              href={image}
              x="9.3"
              y="9.3"
              width="29.4"
              height="29.4"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#centerClip)"
            />
          ) : null}
          {[...Array(7)].map((_, i) => (
            <circle key={i} cx="24" cy="24" r={15.3 + i * 1.25} fill="none" stroke="#3a3a3a" strokeWidth="0.35" />
          ))}
          <circle cx="24" cy="24" r="24" fill="url(#light)" />
          <circle cx="24" cy="24" r="1.2" fill="#050505" stroke="#111" strokeWidth="0.2" />
        </svg>
      </div>
      <style jsx>{`
        .record-container {
          position: relative;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spinning-record {
          animation: spin 5s linear infinite;
          animation-play-state: paused;
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default SpinningRecord;
