// src/app/page.tsx

'use client';

import { Header } from '@/components/layout/Header';
import { TopToolbar } from '@/components/workspace/TopToolbar';
import { Canvas } from '@/components/workspace/Canvas';
import { HistogramViewer } from '@/components/workspace/HistogramViewer';
import { BottomToolbar } from '@/components/layout/BottomToolbar';
import { BatchPanel } from '@/components/batch/BatchPanel';
import { useImageStore } from '@/store/imageStore';

export default function Home() {
  const { mode } = useImageStore();

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden relative">
      {/* Header with Mode Toggle - Sticky Top */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      {/* Main Content Area - Flex Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {mode === 'single' ? (
          <>
            {/* Single Image Mode */}
            {/* Top Toolbar - Sticky */}
            <div className="sticky top-0 z-40">
              <TopToolbar />
            </div>
            
            {/* Canvas Area - Scrollable */}
            <div className="flex-1 overflow-auto relative">
              <Canvas />
            </div>
            
            {/* Histogram Panel - Relative Position */}
            <div className="relative border-t border-gray-700 p-4 bg-gray-900 overflow-x-auto">
              <div className="max-w-4xl mx-auto">
                <HistogramViewer />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Batch Processing Mode */}
            <div className="flex-1 overflow-hidden relative">
              <BatchPanel />
            </div>
          </>
        )}
      </div>

      {/* Bottom Toolbar - Sticky Bottom */}
      <div className="sticky bottom-0 z-30">
        <BottomToolbar />
      </div>
    </div>
  );
}