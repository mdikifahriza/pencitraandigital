'use client';

import React, { useEffect, useRef } from 'react';
import { useImageStore } from '@/store/imageStore';
import { ImageIcon, Loader2 } from 'lucide-react';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageData, isProcessing } = useImageStore();

  useEffect(() => {
    if (!imageData.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData.current;
  }, [imageData.current]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-900 relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}

      {imageData.current ? (
        <div className="relative bg-checkerboard rounded-lg shadow-2xl overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[calc(100vh-120px)] lg:max-h-[calc(100vh-200px)] object-contain"
          />
        </div>
      ) : (
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-800 mb-4">
            <ImageIcon size={40} className="text-gray-600 lg:w-12 lg:h-12" />
          </div>
          <div className="text-gray-500 text-base lg:text-lg mb-2 font-medium">
            No image loaded
          </div>
          <div className="text-gray-600 text-sm">
            Upload an image to get started
          </div>
          <div className="text-gray-700 text-xs mt-2 lg:hidden">
            Tap the menu icon to upload
          </div>
        </div>
      )}
    </div>
  );
};