import React, { useRef, useEffect, useState } from 'react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please allow permissions or use upload.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for mirror effect if needed, but usually better to capture raw
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/png');
        
        // Stop stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-md bg-black flex flex-col">
        {error ? (
          <div className="flex-1 flex items-center justify-center text-white p-6 text-center">
            <div>
              <p className="mb-4 text-red-400">{error}</p>
              <Button onClick={onClose} variant="secondary">Close</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative flex-1 overflow-hidden">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               
               {/* Scanning Overlay Effect */}
               <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 h-0.5 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_2s_linear_infinite] opacity-70"></div>
                  <div className="absolute inset-0 border-2 border-white/20 m-8 rounded-3xl">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl"></div>
                  </div>
                  <div className="absolute bottom-12 left-0 right-0 text-center">
                     <span className="bg-black/50 text-green-400 px-3 py-1 rounded text-xs uppercase tracking-widest font-mono">
                        Face Detection Active
                     </span>
                  </div>
               </div>
            </div>
            
            <div className="p-8 bg-black/90 flex justify-between items-center">
              <button 
                onClick={onClose}
                className="text-white p-4 hover:bg-white/10 rounded-full transition-colors"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
              >
                <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform"></div>
              </button>

              <div className="w-16"></div> {/* Spacer for alignment */}
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};