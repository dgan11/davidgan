import { Pause, Play } from 'lucide-react';
import SpinningRecord from '../SpinningRecord';

export function PlayButtonV2({
  albumCoverUrl,
  isPlaying,
  trackName,
  artistName,
  sublabel,
}: {
  albumCoverUrl: string;
  isPlaying: boolean;
  trackName: string;
  artistName: string;
  sublabel: string;
}) {
  const buttonClasses = isPlaying
    ? 'bg-[#ddd9d3] text-[#555] shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
    : 'bg-[#e8e6e0] text-[#555] shadow-[0_2px_5px_rgba(0,0,0,0.06)]';

  return (
    <>
      <SpinningRecord size={64} image={albumCoverUrl} isPlaying={isPlaying} />
      <div className="min-w-0 flex-1">
        <p className="block truncate pb-px text-[13px] font-medium leading-[1.25] text-[#333]">
          {trackName}
        </p>
        <p className="block truncate pt-px text-[12px] italic leading-[1.25] text-[#666]">
          {artistName}
        </p>
        <p className="block truncate pt-1 text-[11px] leading-[1.2] text-[#8a857d]">
          {sublabel}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center justify-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${buttonClasses}`}
        >
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
        </div>
      </div>
    </>
  );
}
