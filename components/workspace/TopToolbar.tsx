'use client';

import React from 'react';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  SplitSquareHorizontal,
  RotateCcw,
  Download
} from 'lucide-react';
import { useImageStore } from '@/store/imageStore';

export const TopToolbar: React.FC = () => {
  const { 
    imageData,
    history,
    historyIndex,
    zoomPan,
    beforeAfter,
    undo,
    redo,
    canUndo,
    canRedo,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleBeforeAfter,
    resetToOriginal,
  } = useImageStore();

  const hasImage = imageData.current !== null;

  const handleDownload = () => {
    if (!imageData.current) return;
    
    const link = document.createElement('a');
    link.href = imageData.current;
    link.download = `processed-${imageData.fileName || 'image.png'}`;
    link.click();
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        {/* Left: History Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-2
              ${canUndo() 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
            <span className="text-xs hidden sm:inline">Undo</span>
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-2
              ${canRedo() 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
            <span className="text-xs hidden sm:inline">Redo</span>
          </button>

          {/* History Counter */}
          {hasImage && (
            <div className="text-xs text-gray-500 ml-2 hidden md:block">
              {historyIndex + 1} / {history.length}
            </div>
          )}
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={!hasImage || zoomPan.zoom <= 0.1}
            className={`
              p-2 rounded-lg transition-colors
              ${hasImage && zoomPan.zoom > 0.1
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>

          <div className="px-3 py-1 bg-gray-900 rounded-lg text-xs font-medium text-gray-300 min-w-[60px] text-center">
            {hasImage ? `${Math.round(zoomPan.zoom * 100)}%` : '—'}
          </div>

          <button
            onClick={zoomIn}
            disabled={!hasImage || zoomPan.zoom >= 5}
            className={`
              p-2 rounded-lg transition-colors
              ${hasImage && zoomPan.zoom < 5
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>

          <button
            onClick={resetZoom}
            disabled={!hasImage || zoomPan.zoom === 1}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-1
              ${hasImage && zoomPan.zoom !== 1
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Fit to Screen"
          >
            <Maximize2 size={18} />
            <span className="text-xs hidden lg:inline">Fit</span>
          </button>
        </div>

        {/* Right: View & Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleBeforeAfter}
            disabled={!hasImage || !imageData.original}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-2
              ${beforeAfter.enabled 
                ? 'bg-blue-600 text-white' 
                : hasImage && imageData.original
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Before/After Comparison"
          >
            <SplitSquareHorizontal size={18} />
            <span className="text-xs hidden sm:inline">Compare</span>
          </button>

          <button
            onClick={resetToOriginal}
            disabled={!hasImage || !imageData.original}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-2
              ${hasImage && imageData.original
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            title="Reset to Original"
          >
            <RotateCcw size={18} />
            <span className="text-xs hidden lg:inline">Reset</span>
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1" />

          <button
            onClick={handleDownload}
            disabled={!hasImage}
            className={`
              px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium
              ${hasImage
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
            title="Download Image"
          >
            <Download size={18} />
            <span className="text-sm hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};