import React, { useRef } from 'react';
import { Button } from './Button';
import { fileToBase64 } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  onCameraStart: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, onCameraStart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelected(base64);
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed border-stone-300 rounded-2xl bg-white hover:bg-stone-50 transition-colors">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl mb-2">
        📸
      </div>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-stone-800">Upload your photo</h3>
        <p className="text-stone-500 mt-2 text-sm">Use a clear selfie for best results</p>
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button 
          variant="primary" 
          className="w-full justify-center"
          onClick={onCameraStart}
        >
          📷 Take Selfie
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Photo
        </Button>
      </div>
    </div>
  );
};