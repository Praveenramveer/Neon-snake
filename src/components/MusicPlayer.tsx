import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3",
    cover: "https://picsum.photos/seed/neon1/200/200"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Neural Beats",
    url: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3",
    cover: "https://picsum.photos/seed/neon2/200/200"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Bionic Echo",
    url: "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3",
    cover: "https://picsum.photos/seed/neon3/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed on track change:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#ff00ff] p-6 shadow-[0_0_15px_#ff00ff,inset_0_0_10px_#ff00ff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff]/20 animate-pulse" />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
        onError={(e) => console.error("Audio error:", e)}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-20 h-20 border border-[#00ffff] grayscale contrast-150 transition-all duration-75 ${isPlaying ? 'animate-[glitch_0.2s_infinite]' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#00ffff]/10 pointer-events-none" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#00ffff] font-pixel text-2xl truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#ff00ff] text-lg font-pixel tracking-widest">[ SOURCE: {currentTrack.artist} ]</p>
        </div>
      </div>

      <div className="w-full bg-[#00ffff]/10 h-4 border border-[#00ffff]/30 mb-6 relative">
        <div 
          className="h-full bg-[#00ffff] shadow-[0_0_10px_#00ffff]"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-black font-bold mix-blend-difference">
          {Math.floor(progress)}%_SYNCED
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors border border-[#00ffff] p-1">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-[#00ffff] text-black hover:bg-[#ff00ff] transition-all shadow-[0_0_15px_#00ffff]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors border border-[#00ffff] p-1">
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-[#ff00ff]/60 font-pixel">
          <Volume2 size={18} />
          <span className="text-xs">AMP_LVL: 80%</span>
        </div>
      </div>
    </div>
  );
};
