// src/app/page.tsx

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Canvas } from '@/components/workspace/Canvas';
import { HistogramViewer } from '@/components/workspace/HistogramViewer';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto">
            <Canvas />
          </div>
          
          {/* Histogram Panel - Bottom */}
          <div className="border-t border-gray-700 p-4 bg-gray-900 overflow-x-auto">
            <div className="max-w-4xl mx-auto">
              <HistogramViewer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}