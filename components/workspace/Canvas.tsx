'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useImageStore } from '@/store/imageStore';
import { ImageIcon, Loader2 } from 'lucide-react';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const { 
    imageData, 
    isProcessing, 
    zoomPan, 
    beforeAfter,
    setPan 
  } = useImageStore();

  // Draw image with zoom and pan
  useEffect(() => {
    if (!imageData.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      if (beforeAfter.enabled && imageData.original) {
        // Before/After mode
        const splitX = (beforeAfter.splitPosition / 100) * canvas.width;
        
        // Draw "after" (current) image
        ctx.drawImage(img, 0, 0);
        
        // Draw "before" (original) image on left side
        const originalImg = new Image();
        originalImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, canvas.height);
          ctx.clip();
          ctx.drawImage(originalImg, 0, 0);
          ctx.restore();
          
          // Draw split line
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, canvas.height);
          ctx.stroke();
          
          // Draw handle
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(splitX, canvas.height / 2, 8, 0, Math.PI * 2);
          ctx.fill();
        };
        originalImg.src = imageData.original;
      } else {
        // Normal mode
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = imageData.current;
  }, [imageData.current, imageData.original, beforeAfter.enabled, beforeAfter.splitPosition]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (beforeAfter.enabled) return; // Disable panning in before/after mode
    setIsPanning(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;
    
    setPan(zoomPan.pan.x + deltaX, zoomPan.pan.y + deltaY);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Before/After slider handler
  const handleBeforeAfterDrag = (e: React.MouseEvent) => {
    if (!beforeAfter.enabled || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    useImageStore.getState().setBeforeAfterPosition(percentage);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-900 relative overflow-hidden"
      onMouseDown={beforeAfter.enabled ? undefined : handleMouseDown}
      onMouseMove={beforeAfter.enabled ? undefined : handleMouseMove}
      onMouseUp={beforeAfter.enabled ? undefined : handleMouseUp}
      onMouseLeave={beforeAfter.enabled ? undefined : handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : (beforeAfter.enabled ? 'default' : 'grab') }}
    >
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
        <div 
          className="relative bg-checkerboard rounded-lg shadow-2xl overflow-hidden"
          style={{
            transform: `scale(${zoomPan.zoom}) translate(${zoomPan.pan.x / zoomPan.zoom}px, ${zoomPan.pan.y / zoomPan.zoom}px)`,
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
          onMouseMove={beforeAfter.enabled ? handleBeforeAfterDrag : undefined}
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[calc(100vh-300px)] object-contain"
          />
          
          {/* Before/After Labels */}
          {beforeAfter.enabled && (
            <>
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
                After
              </div>
            </>
          )}
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
        </div>
      )}
    </div>
  );
};