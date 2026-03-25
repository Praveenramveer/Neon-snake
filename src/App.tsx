import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Music, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-pixel selection:bg-[#ff00ff] selection:text-black overflow-x-hidden relative">
      <div className="crt-overlay" />
      <div className="noise-overlay" />
      <div className="scanline" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b-2 border-[#00ffff]/30 bg-black/80 screen-tear">
        <div className="flex items-center gap-3">
          <div className="p-2 border-2 border-[#00ffff] shadow-[0_0_10px_#00ffff]">
            <Gamepad2 className="text-[#00ffff]" size={24} />
          </div>
          <h1 className="text-4xl font-pixel tracking-tighter uppercase glitch-text" data-text="NEURAL_LINK_v1.0.4">
            NEURAL_LINK_v1.0.4
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="p-1 border-2 border-dashed border-[#00ffff]/50">
            <div className="flex items-center gap-2 px-6 py-2 border-2 border-[#ff00ff] shadow-[0_0_10px_#ff00ff] bg-black">
              <Trophy size={18} className="text-[#ff00ff]" />
              <span className="text-2xl font-pixel tracking-widest uppercase">SYNC_VAL: {score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 min-h-[calc(100vh-100px)]">
        
        {/* Game Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center screen-tear"
        >
          <div className="mb-10 text-center">
            <h2 className="text-6xl font-pixel text-[#00ffff] mb-3 tracking-tighter uppercase glitch-text" data-text="CORE_SNAKE_PROC">CORE_SNAKE_PROC</h2>
            <p className="text-[#ff00ff] text-xl uppercase tracking-[0.5em] animate-pulse">[ KERNEL_STATUS: RUNNING ]</p>
          </div>
          <SnakeGame onScoreChange={setScore} />
        </motion.section>

        {/* Music Section */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-auto flex flex-col items-center lg:items-start"
        >
          <div className="mb-6 flex items-center gap-3">
            <Music className="text-[#ff00ff]" size={24} />
            <h2 className="text-3xl font-pixel text-[#ff00ff] tracking-widest uppercase">WAVE_BUFFER_STREAM</h2>
          </div>
          <MusicPlayer />
          
          <div className="mt-8 p-6 border-2 border-[#00ffff]/30 bg-black w-full max-w-md relative screen-tear">
            <div className="absolute -top-3 left-4 bg-black px-2 text-[#00ffff] text-sm font-bold">CMD_LOG_v1.0</div>
            <ul className="space-y-3 text-lg font-pixel text-[#00ffff]/70">
              <li className="flex items-center gap-3">
                <span className="border border-[#00ffff] px-2 text-sm">VEC_IN</span>
                <span>NAV_INPUT_DETECTED</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="border border-[#00ffff] px-2 text-sm">HLT_SIG</span>
                <span>PROCESS_SUSPENSION</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="border border-[#00ffff] px-2 text-sm">ERR_0</span>
                <span>COLLISION_AVOIDANCE_REQ</span>
              </li>
            </ul>
          </div>
        </motion.section>

      </main>

      <footer className="relative z-10 p-8 text-center border-t-2 border-[#00ffff]/30">
        <p className="text-[#00ffff]/40 text-lg font-pixel tracking-[0.5em] uppercase">
          [ NODE_ID: AIS_77_X ] [ ENCRYPTION: AES_256_ACTIVE ] [ UPTIME: 99.9% ]
        </p>
      </footer>
    </div>
  );
}
