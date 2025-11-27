// src/components/workspace/Header.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SplitSquareHorizontal,
  BarChart3,
  ImageIcon,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useImageStore } from "@/store/imageStore";
import { HistogramViewer } from "@/components/workspace/HistogramViewer";

interface HeaderProps {
  onFileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onFileClick }) => {
  const {
    mode,
    setMode,
    batchImages,
    imageData,
    historyIndex,
    history,
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
  } = useImageStore();

  const hasImage = imageData.current !== null;

  const [historyMenu, setHistoryMenu] = useState(false);
  const [zoomMenu, setZoomMenu] = useState(false);
  const [modeMenu, setModeMenu] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);

  // Refs untuk dropdown containers
  const historyMenuRef = useRef<HTMLDivElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  // Effect untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyMenuRef.current &&
        !historyMenuRef.current.contains(event.target as Node)
      ) {
        setHistoryMenu(false);
      }
      if (
        zoomMenuRef.current &&
        !zoomMenuRef.current.contains(event.target as Node)
      ) {
        setZoomMenu(false);
      }
      if (
        modeMenuRef.current &&
        !modeMenuRef.current.contains(event.target as Node)
      ) {
        setModeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler untuk historyMenu dengan mutual exclusion
  const handleHistoryMenuToggle = () => {
    setZoomMenu(false); // Tutup zoomMenu jika terbuka
    setHistoryMenu(!historyMenu);
  };

  // Handler untuk zoomMenu dengan mutual exclusion
  const handleZoomMenuToggle = () => {
    setHistoryMenu(false); // Tutup historyMenu jika terbuka
    setZoomMenu(!zoomMenu);
  };

  // Handler untuk modeMenu (tidak perlu mutual exclusion karena tidak terkait)
  const handleModeMenuToggle = () => {
    setModeMenu(!modeMenu);
  };

  // Handler untuk toggleBeforeAfter dengan mutual exclusion terhadap histogram
  const handleToggleBeforeAfter = () => {
    toggleBeforeAfter(); // Panggil fungsi store
    // Jika beforeAfter akan diaktifkan, tutup histogram
    if (!beforeAfter.enabled) {
      setShowHistogram(false);
    }
  };

  // Handler untuk showHistogram dengan mutual exclusion terhadap beforeAfter
  const handleShowHistogramToggle = () => {
    const newShowHistogram = !showHistogram;
    setShowHistogram(newShowHistogram);
    // Jika histogram akan diaktifkan, nonaktifkan beforeAfter
    if (newShowHistogram) {
      // Asumsikan store memiliki fungsi untuk menonaktifkan beforeAfter
      // Jika tidak, tambahkan di store (misalnya, setBeforeAfterEnabled(false))
      // Untuk sekarang, kita anggap toggleBeforeAfter bisa dipanggil untuk menonaktifkan
      if (beforeAfter.enabled) {
        toggleBeforeAfter(); // Ini akan menonaktifkan jika sudah aktif
      }
    }
  };

  // Handler untuk tombol File: panggil onFileClick dan tutup semua dropdown/fitur
  const handleFileClick = () => {
    onFileClick(); // Panggil prop asli
    // Tutup semua dropdown dan fitur
    setHistoryMenu(false);
    setZoomMenu(false);
    setModeMenu(false);
    setShowHistogram(false);
    // Nonaktifkan beforeAfter jika aktif
    if (beforeAfter.enabled) {
      toggleBeforeAfter(); // Asumsikan ini menonaktifkan
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-3 lg:px-4 py-2">
      <div className="flex items-center justify-between gap-2 lg:gap-4">
        
        {/* LEFT: File Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleFileClick} // Gunakan handler baru
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <Upload size={18} />
            <span className="hidden sm:inline text-sm font-medium">File</span>
          </button>
        </div>

        {/* CENTER: Undo/Redo + Zoom Controls */}
        <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-center">
          
          {/* UNDO/REDO - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`p-2 rounded-lg ${
                canUndo()
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <Undo2 size={18} />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`p-2 rounded-lg ${
                canRedo()
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <Redo2 size={18} />
            </button>

            {hasImage && (
              <div className="text-xs text-gray-500 ml-1">
                {historyIndex + 1}/{history.length}
              </div>
            )}
          </div>

          {/* UNDO/REDO - Mobile Dropdown */}
          <div className="relative lg:hidden" ref={historyMenuRef}>
            <button
              onClick={handleHistoryMenuToggle}
              className="p-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
              <Undo2 size={18} />
            </button>

            {historyMenu && (
              <div className="absolute left-0 top-[110%] w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1 z-50">
                <button
                  onClick={() => {
                    undo();
                    setHistoryMenu(false);
                  }}
                  disabled={!canUndo()}
                  className="block w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 disabled:text-gray-500"
                >
                  Undo
                </button>
                <button
                  onClick={() => {
                    redo();
                    setHistoryMenu(false);
                  }}
                  disabled={!canRedo()}
                  className="block w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 disabled:text-gray-500"
                >
                  Redo
                </button>
              </div>
            )}
          </div>

          {/* ZOOM - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={!hasImage || zoomPan.zoom <= 0.1}
              className={`p-2 rounded-lg ${
                hasImage && zoomPan.zoom > 0.1
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <ZoomOut size={18} />
            </button>

            <div className="px-3 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300 min-w-[60px] text-center">
              {hasImage ? `${Math.round(zoomPan.zoom * 100)}%` : "—"}
            </div>

            <button
              onClick={zoomIn}
              disabled={!hasImage || zoomPan.zoom >= 5}
              className={`p-2 rounded-lg ${
                hasImage && zoomPan.zoom < 5
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={resetZoom}
              disabled={!hasImage || zoomPan.zoom === 1}
              className={`p-2 rounded-lg ${
                hasImage && zoomPan.zoom !== 1
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* ZOOM - Mobile Dropdown */}
          <div className="relative lg:hidden flex items-center" ref={zoomMenuRef}>
            <button
              onClick={handleZoomMenuToggle}
              className="p-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
              <ZoomIn size={18} />
            </button>

            <div className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 min-w-[42px] text-center">
              {hasImage ? `${Math.round(zoomPan.zoom * 100)}%` : "—"}
            </div>

            {zoomMenu && (
              <div className="absolute left-0 top-[110%] w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1 z-50">
                <button
                  onClick={() => {
                    zoomOut();
                    setZoomMenu(false);
                  }}
                  disabled={!hasImage || zoomPan.zoom <= 0.1}
                  className="block w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 disabled:text-gray-500"
                >
                  Zoom Out
                </button>
                <button
                  onClick={() => {
                    zoomIn();
                    setZoomMenu(false);
                  }}
                  disabled={!hasImage || zoomPan.zoom >= 5}
                  className="block w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 disabled:text-gray-500"
                >
                  Zoom In
                </button>
                <button
                  onClick={() => {
                    resetZoom();
                    setZoomMenu(false);
                  }}
                  disabled={!hasImage || zoomPan.zoom === 1}
                  className="block w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 disabled:text-gray-500"
                >
                  Fit to Screen
                </button>
              </div>
            )}
          </div>

          {/* COMPARE + HISTOGRAM */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleBeforeAfter}
              disabled={!hasImage || !imageData.original}
              className={`p-2 rounded-lg ${
                beforeAfter.enabled
                  ? "bg-blue-600 text-white"
                  : hasImage
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <SplitSquareHorizontal size={18} />
            </button>

            <button
              onClick={handleShowHistogramToggle}
              disabled={!hasImage}
              className={`p-2 rounded-lg ${
                hasImage
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              <BarChart3 size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT: Mode Toggle */}
        <div className="flex-shrink-0">
          
          {/* Desktop Mode Toggle */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMode("single")}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${
                  mode === "single"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300"
                }
              `}
            >
              <ImageIcon size={16} />
              <span>Single</span>
            </button>

            <button
              onClick={() => setMode("batch")}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${
                  mode === "batch"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300"
                }
              `}
            >
              <Layers size={16} />
              <span>Batch</span>
              {mode === "batch" && batchImages.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {batchImages.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Mode Dropdown */}
          <div className="relative lg:hidden" ref={modeMenuRef}>
            <button
              onClick={handleModeMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {mode === "single" ? <ImageIcon size={18} /> : <Layers size={18} />}
              <span className="text-sm font-medium">
                {mode === "single" ? "Single" : "Batch"}
              </span>
              {mode === "batch" && batchImages.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {batchImages.length}
                </span>
              )}
              <ChevronDown size={16} />
            </button>

            {modeMenu && (
              <div className="absolute right-0 top-[110%] w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1 z-50">
                <button
                  onClick={() => {
                    setMode("single");
                    setModeMenu(false);
                  }}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700
                    ${mode === "single" ? "bg-blue-600 text-white" : "text-gray-300"}
                  `}
                >
                  <ImageIcon size={16} />
                  Single
                </button>
                <button
                  onClick={() => {
                    setMode("batch");
                    setModeMenu(false);
                  }}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700
                    ${mode === "batch" ? "bg-blue-600 text-white" : "text-gray-300"}
                  `}
                >
                  <Layers size={16} />
                  Batch
                  {batchImages.length > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {batchImages.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Histogram Popup */}
      {showHistogram && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <HistogramViewer onClose={() => setShowHistogram(false)} />
          </div>
        </div>
      )}
    </header>
  );
};
