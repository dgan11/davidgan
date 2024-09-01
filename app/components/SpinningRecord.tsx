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
            <radialGradient id="record-gradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="50%" stopColor="#111111" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <radialGradient id="highlight-gradient" cx="30%" cy="30%" r="60%" fx="25%" fy="25%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="24" fill="url(#record-gradient)" />
          <circle cx="24" cy="24" r="24" fill="url(#highlight-gradient)" />
          {/* Album cover circle */}
          <circle cx="24" cy="24" r="11" fill="#333333" />
          {image && (
            <clipPath id="centerClip">
              <circle cx="24" cy="24" r="10.8" />
            </clipPath>
          )}
          {image ? (
            <image
              href={image}
              x="13.2"
              y="13.2"
              width="21.6"
              height="21.6"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#centerClip)"
            />
          ) : null}
          <g className="grooves">
            {[...Array(10)].map((_, i) => (
              <circle key={i} cx="24" cy="24" r={11.5 + i * 1.2} fill="none" stroke="#444444" strokeWidth="0.4" />
            ))}
          </g>
          {/* Adjust the center nub */}
          <circle cx="24" cy="24" r="1" fill="#D0D0D0" fillOpacity="0.7" stroke="#808080" strokeWidth="0.3" />
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
        .light-reflections {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default SpinningRecord;
