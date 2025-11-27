// src/components/workspace/Canvas.tsx

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import { useImageProcessor } from '@/hooks/useImageProcessor';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk input file tersembunyi
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { 
    imageData, 
    isProcessing, 
    zoomPan, 
    beforeAfter,
    setPan,
    mode,
    addBatchImages
  } = useImageStore();

  const { handleUpload } = useImageProcessor();

  // Fungsi untuk menangani klik tombol Select Files
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fungsi untuk menangani perubahan file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      if (mode === 'batch') {
        await addBatchImages(files);
      } else {
        await handleUpload(files[0]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }

    // Reset input
    e.target.value = '';
  };

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
    if (beforeAfter.enabled) return;
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

  // Drag & Drop handlers (same as BatchPanel)
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    try {
      if (mode === 'batch') {
        await addBatchImages(files);
      } else {
        await handleUpload(files[0]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }, [mode, addBatchImages, handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only hide if leaving the container, not child elements
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-900 relative overflow-hidden"
      onMouseDown={beforeAfter.enabled ? undefined : handleMouseDown}
      onMouseMove={beforeAfter.enabled ? undefined : handleMouseMove}
      onMouseUp={beforeAfter.enabled ? undefined : handleMouseUp}
      onMouseLeave={beforeAfter.enabled ? undefined : handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{ cursor: isPanning ? 'grabbing' : (beforeAfter.enabled ? 'default' : 'grab') }}
    >
      {/* Input file tersembunyi */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={mode === 'batch'}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-8">
          <div className="w-full max-w-4xl border-2 border-dashed border-blue-500 rounded-lg p-16 text-center bg-gray-800/95 backdrop-blur-sm">
            <Upload size={80} className="mx-auto text-gray-500 mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold text-white mb-3">
              {mode === 'batch' ? 'Upload Multiple Images' : 'Upload Image'}
            </h3>
            <p className="text-gray-400 text-base mb-8">
              Drag & drop images here or click to browse
            </p>
            <button 
              onClick={handleSelectFiles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Select Files
            </button>
            <p className="text-xs text-gray-500 mt-6">
              Supported: JPG, PNG, WebP, GIF (max 10MB each)
            </p>
          </div>
        </div>
      )}

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
        <div className="w-full max-w-4xl mx-auto">
          <div className="border-2 border-dashed border-blue-500 rounded-lg p-16 text-center bg-gray-800/50">
            <Upload size={80} className="mx-auto text-gray-500 mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold text-white mb-3">
              {mode === 'batch' ? 'Upload Multiple Images' : 'Upload Image'}
            </h3>
            <p className="text-gray-400 text-base mb-8">
              Drag & drop images here or click to browse
            </p>
            <button 
              onClick={handleSelectFiles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Select Files
            </button>
            <p className="text-xs text-gray-500 mt-6">
              Supported: JPG, PNG, WebP, GIF (max 10MB each)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
