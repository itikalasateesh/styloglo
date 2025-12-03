import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { editUserImage } from '../services/geminiService';
import { StyleProfile } from '../types';

interface StyleEditorProps {
  originalImage: string;
  autoTriggerPrompt?: string | null;
  onEditComplete?: () => void;
  profile?: StyleProfile | null;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ originalImage, autoTriggerPrompt, onEditComplete, profile }) => {
  const [currentImage, setCurrentImage] = useState<string>(originalImage);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([originalImage]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoTriggerPrompt && !isProcessing) {
      setPrompt(autoTriggerPrompt);
      handleEdit(autoTriggerPrompt);
    }
  }, [autoTriggerPrompt]);

  const handleEdit = async (promptText: string = prompt) => {
    if (!promptText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const newImage = await editUserImage(currentImage, promptText);
      setCurrentImage(newImage);
      setHistory(prev => [...prev, newImage]);
      setPrompt(''); 
      if (onEditComplete) onEditComplete();
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try a different prompt.");
      if (onEditComplete) onEditComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentImage(newHistory[newHistory.length - 1]);
    }
  };

  const handleReset = () => {
    setCurrentImage(originalImage);
    setHistory([originalImage]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[3/4] md:aspect-square mx-auto max-w-md group border border-stone-800 perspective-1000">
        <img 
          src={currentImage} 
          alt="Style Edit" 
          className={`w-full h-full object-cover transition-all duration-700 ${isProcessing ? 'blur-sm opacity-50 scale-95' : 'blur-0 scale-100 opacity-100'}`}
        />
        
        {/* Futuristic HUD Overlays */}
        {profile && !isProcessing && currentImage === originalImage && (
          <div className="absolute inset-0 pointer-events-none p-4">
             {/* Center Face Mesh 3D Wireframe Overlay */}
             <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg viewBox="0 0 200 200" className="w-64 h-64 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                    {/* Face Contour */}
                    <path d="M50 60 Q100 20 150 60 Q160 100 150 140 Q100 180 50 140 Q40 100 50 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-[pulse_4s_infinite]" />
                    {/* Horizontal Grid Lines */}
                    <path d="M50 80 Q100 90 150 80" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d="M55 100 Q100 110 145 100" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d="M65 120 Q100 130 135 120" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    {/* Vertical Grid Lines */}
                    <path d="M100 40 Q100 100 100 160" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d="M80 50 Q70 100 80 150" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d="M120 50 Q130 100 120 150" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    
                    <circle cx="100" cy="100" r="2" fill="currentColor" className="animate-ping" />
                </svg>
             </div>

             {/* Gender Tag (Top Left) */}
             <div className="absolute top-6 left-6 animate-slide-in-right">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                    <span className="font-mono text-green-400 text-xs tracking-[0.2em] uppercase">Target Locked</span>
                </div>
                <div className="mt-1 bg-black/60 backdrop-blur-md border-l-2 border-green-400 pl-3 pr-4 py-1 text-white shadow-lg">
                    <p className="font-bold text-lg uppercase font-mono">{profile.gender}</p>
                </div>
             </div>

             {/* Face Shape Tag - Pointing to Jawline */}
             <div className="absolute top-[65%] right-8 animate-slide-in-left delay-100 animate-breathe flex items-center gap-4">
               <div className="relative bg-black/40 backdrop-blur-md border border-cyan-500/30 p-2 pr-4 rounded-r-xl border-l-4 border-l-cyan-400 order-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                 <div className="absolute -left-1 -top-1 w-2 h-2 bg-cyan-400"></div>
                 <div className="text-[10px] text-cyan-300 uppercase tracking-wider font-mono">Face Structure</div>
                 <div className="text-white font-bold text-lg leading-none">{profile.faceShape}</div>
               </div>
               <div className="w-16 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent order-1 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
               </div>
             </div>
             
             {/* Skin Tone Tag - Pointing to Cheek */}
             <div className="absolute top-[50%] left-8 animate-slide-in-right delay-200 animate-breathe-delayed flex items-center gap-4">
               <div className="relative bg-black/40 backdrop-blur-md border border-pink-500/30 p-2 pl-4 rounded-l-xl border-r-4 border-r-pink-500 text-right shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                 <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-pink-500"></div>
                 <div className="text-[10px] text-pink-300 uppercase tracking-wider font-mono">Skin Tone Analysis</div>
                 <div className="text-white font-bold text-lg leading-none">{profile.skinTone}</div>
                 
                 {/* 3D Wave Effect */}
                 <div className="absolute -right-16 top-0 bottom-0 w-12 overflow-hidden opacity-50 pointer-events-none">
                    <div className="w-full h-full border-r-2 border-pink-500/50 rounded-[100%] animate-[wave_2s_ease-in-out_infinite]"></div>
                    <div className="w-full h-full border-r-2 border-pink-500/30 rounded-[100%] animate-[wave_2s_ease-in-out_infinite_0.2s] absolute top-0"></div>
                 </div>
               </div>

               <div className="w-12 h-[1px] bg-gradient-to-r from-pink-500 to-transparent relative">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
               </div>
             </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            {/* Holographic Transformation Effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            
            {/* Spinning Rings */}
            <div className="absolute w-48 h-48 border-2 border-purple-500/30 rounded-full animate-[spin_4s_linear_infinite] [transform-style:preserve-3d]">
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full [transform:rotateX(60deg)] animate-[spin_3s_linear_infinite_reverse]"></div>
            </div>
            
            <div className="text-white text-center p-6 relative z-10">
              <div className="animate-spin text-5xl mb-6 drop-shadow-[0_0_25px_rgba(216,180,254,0.8)] transform hover:scale-110 transition-transform">✨</div>
              <p className="font-mono text-cyan-300 text-xs tracking-[0.3em] uppercase mb-2 animate-pulse">Reconstructing...</p>
              <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{prompt || "Applying Magic"}</p>
            </div>
            
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={handleReset}
                className="bg-black/60 backdrop-blur text-white p-2 px-4 rounded-full border border-white/20 text-xs font-bold hover:bg-white hover:text-black transition-all"
            >
                RESET
            </button>
            <button 
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="bg-black/60 backdrop-blur text-white p-2 px-4 rounded-full border border-white/20 text-xs font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
                UNDO
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm text-center border border-red-900/50 backdrop-blur">
          ⚠️ {error}
        </div>
      )}

      {/* Manual Prompt Input */}
      <div className="bg-white p-2 pl-4 rounded-full shadow-lg border border-stone-100 flex gap-2 items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type custom edit (e.g. 'Blue neon hair')"
          className="flex-1 bg-transparent focus:outline-none text-sm text-stone-800 placeholder-stone-400"
          onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
        />
        <Button 
          onClick={() => handleEdit()} 
          disabled={!prompt.trim() || isProcessing}
          className="!rounded-full !w-10 !h-10 !px-0 flex items-center justify-center bg-stone-900 text-white"
        >
          ➜
        </Button>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        @keyframes wave {
            0%, 100% { transform: scaleX(1); opacity: 0.5; }
            50% { transform: scaleX(1.2); opacity: 0.8; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-breathe { animation: breathe 3s ease-in-out infinite; }
        .animate-breathe-delayed { animation: breathe 3s ease-in-out infinite 1.5s; }
      `}</style>
    </div>
  );
};