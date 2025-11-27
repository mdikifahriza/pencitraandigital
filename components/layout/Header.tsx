'use client';

import React from 'react';
import { Image, Layers, ImageIcon } from 'lucide-react';
import { useImageStore } from '@/store/imageStore';

export const Header: React.FC = () => {
  const { mode, setMode, batchImages } = useImageStore();

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Image size={28} className="text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-white truncate">
              Simple Image Processing Studio
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              powered by JavaScript + Canvas
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setMode('single')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${mode === 'single' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Single</span>
          </button>
          
          <button
            onClick={() => setMode('batch')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${mode === 'batch' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <Layers size={16} />
            <span className="hidden sm:inline">Batch</span>
            {mode === 'batch' && batchImages.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {batchImages.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};