'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FileSection } from '@/components/menu/FileSection';
import { AdjustmentSection } from '@/components/menu/AdjustmentSection';
import { FilterSection } from '@/components/menu/FilterSection';
import { HistogramSection } from '@/components/menu/HistogramSection';
import { MorphologySection } from '@/components/menu/MorphologySection';
import { useUiStore } from '@/store/uiStore';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUiStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeSidebar]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64
          bg-gray-800 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
          {/* File Operations */}
          <FileSection />
          
          {/* Adjustments (Brightness, Contrast, etc) */}
          <AdjustmentSection />
          
          {/* Filters (Blur, Sharpen, Edge Detection) */}
          <FilterSection />
          
          {/* Histogram & Thresholding */}
          <HistogramSection />
          
          {/* Morphology (Erosion, Dilation, etc) */}
          <MorphologySection />
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden p-4 border-t border-gray-700 bg-gray-900/50">
          <p className="text-xs text-gray-500 text-center">
            Swipe left or press ESC to close
          </p>
        </div>
      </aside>
    </>
  );
};