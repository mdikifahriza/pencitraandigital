// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Canvas } from '@/components/workspace/Canvas';
import { BottomToolbar } from '@/components/layout/BottomToolbar';
import { BatchPanel } from '@/components/batch/BatchPanel';
import { FileSection } from '@/components/menu/FileSection';
import { useImageStore } from '@/store/imageStore';
import { X } from 'lucide-react';

export default function Home() {
  const { mode, batchImages } = useImageStore();
  const [fileSectionOpen, setFileSectionOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Munculkan popup saat komponen mount (akses web)
  useEffect(() => {
    setShowWelcomePopup(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">

      {/* Header - Fixed Top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header onFileClick={() => setFileSectionOpen(true)} />
      </div>

      {/* Main Content Area - with padding for fixed header & bottom toolbar */}
      <div 
        className="flex-1 overflow-auto"
        style={{ 
          paddingTop: '56px', // Height of header (adjust if needed)
          paddingBottom: '60px' // Height of bottom toolbar (adjust if needed)
        }}
      >
        {mode === 'single' ? (
          <div className="h-full">
            <Canvas />
          </div>
        ) : (
          <div className="h-full">
            <BatchPanel />
          </div>
        )}
      </div>

      {/* Bottom Toolbar - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomToolbar />
      </div>

      {/* File Section Modal/Panel */}
      {fileSectionOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">File</h3>
                
                {mode === 'batch' && batchImages.length > 0 && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    {batchImages.length} images loaded
                  </span>
                )}
              </div>

              <button
                onClick={() => setFileSectionOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <FileSection />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            {/* Tombol Silang di Pojok Kanan Atas */}
            <button
              onClick={() => setShowWelcomePopup(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition z-10"
            >
              <X size={20} className="text-gray-300" />
            </button>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Aplikasi Pengolahan Citra Digital
              </h3>
              <ul className="text-gray-300 space-y-3 text-sm">
                <li>
                  <strong>1.</strong> Web ini menggunakan pemrosesan di sisi klien sehingga performa di tiap perangkat mungkin berbeda.
                </li>
                <li>
                  <strong>2.</strong> Fitur batch belum berfungsi.
                </li>
                <li>
                  <strong>3.</strong> Gunakan fungsi adjustment dulu karena ketika slider di adjustment di geser, dia akan menghapus semua efek yang dipakai sebelumnya.
                </li>
                <li>
                  <strong>4.</strong> Masih banyak bug dan kurang fitur, ijik kesel, selamat mencoba 😊
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
