import React from 'react';

interface ScannerProps {
  image: string;
}

export const Scanner: React.FC<ScannerProps> = ({ image }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-md aspect-[3/4] md:rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-800">
        <img src={image} alt="Scanning" className="w-full h-full object-cover opacity-50 filter grayscale contrast-125" />
        
        {/* Holographic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:500px] [transform:rotateX(60deg)_scale(2)] opacity-30 animate-[gridMove_5s_linear_infinite]"></div>

        {/* 3D Scanning Beam (Laser) */}
        <div className="absolute inset-x-0 h-2 bg-cyan-400/80 shadow-[0_0_50px_rgba(34,211,238,1)] z-20 animate-[scan_2s_ease-in-out_infinite]"></div>

        {/* 3D Wireframe Face Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
             <div className="w-64 h-80 border border-cyan-500/30 rounded-[50%] relative animate-[spin3D_8s_linear_infinite] [transform-style:preserve-3d]">
                <div className="absolute inset-0 border border-purple-500/30 rounded-[50%] [transform:rotateY(60deg)]"></div>
                <div className="absolute inset-0 border border-pink-500/30 rounded-[50%] [transform:rotateY(-60deg)]"></div>
                <div className="absolute inset-0 border-t border-b border-cyan-400/50 rounded-[50%] [transform:scale(0.8)]"></div>
                
                {/* Floating nodes */}
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
             </div>
        </div>

        {/* Digital Noise / Glitch Effect */}
        <div className="absolute inset-0 bg-repeat opacity-10 animate-[noise_0.2s_steps(2)_infinite]" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+")'}}></div>

        {/* HUD Data Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-30 pointer-events-none">
          <div className="flex justify-between font-mono text-[10px] text-cyan-300 tracking-widest">
            <span className="animate-pulse">AI_ANALYSIS_PROTOCOL_V2.5</span>
            <span>ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
          </div>
          
          <div className="space-y-4">
             {/* Dynamic Analysis Lines */}
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                <span className="text-cyan-400 font-mono text-xs">MAPPING FACIAL LANDMARKS...</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping delay-300"></div>
                <span className="text-pink-400 font-mono text-xs">ANALYZING SKIN PIGMENTATION...</span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-1 w-full bg-stone-800 rounded overflow-hidden mt-4">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-[width_3s_ease-out_forwards] w-0"></div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
        }
        @keyframes spin3D {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }
        @keyframes width {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        @keyframes gridMove {
            0% { transform: rotateX(60deg) scale(2) translateY(0); }
            100% { transform: rotateX(60deg) scale(2) translateY(40px); }
        }
      `}</style>
    </div>
  );
};