// src/components/workspace/BottomToolbar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Filter, 
  BarChart3, 
  Shapes,
  X
} from 'lucide-react';

import { AdjustmentSection } from '@/components/menu/AdjustmentSection';
import { FilterSection } from '@/components/menu/FilterSection';
import { HistogramSection } from '@/components/menu/HistogramSection';
import { MorphologySection } from '@/components/menu/MorphologySection';
import { useImageStore } from '@/store/imageStore';

type ToolbarSection = 
  | 'adjustment' 
  | 'filter' 
  | 'histogram' 
  | 'morphology'
  | null;

export const BottomToolbar: React.FC = () => {
  const { mode, batchImages } = useImageStore();
  const [activeSection, setActiveSection] = useState<ToolbarSection>(null);

  const toggleSection = (section: ToolbarSection) =>
    setActiveSection(activeSection === section ? null : section);

  const closeSection = () => setActiveSection(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSection();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const panelMaxHeight = mode === 'batch' ? 'max-h-[40vh]' : 'max-h-[45vh]';

  const sections = [
    { id: 'adjustment' as const, label: 'Adjustments', icon: Sun },
    { id: 'filter' as const, label: 'Filters', icon: Filter },
    { id: 'histogram' as const, label: 'Histogram', icon: BarChart3 },
    { id: 'morphology' as const, label: 'Morphology', icon: Shapes },
  ];

  return (
    <div className="relative bg-gray-900 border-t border-gray-700 z-30">

      {/* PANEL */}
      {activeSection && (
        <div
          className={`
            absolute bottom-full left-0 right-0 
            bg-gray-800 border-t border-gray-700 
            overflow-y-auto custom-scrollbar shadow-2xl 
            animate-slide-up ${panelMaxHeight}
          `}
        >
          <div className="max-w-7xl mx-auto">

            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>

                {mode === 'batch' && batchImages.length > 0 && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    Apply to {batchImages.length} images
                  </span>
                )}
              </div>

              <button
                onClick={closeSection}
                className="p-2 rounded-lg hover:bg-gray-700 transition"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            <div className="p-4">
              {activeSection === 'adjustment' && <AdjustmentSection />}
              {activeSection === 'filter' && <FilterSection />}
              {activeSection === 'histogram' && <HistogramSection />}
              {activeSection === 'morphology' && <MorphologySection />}
            </div>
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex items-center justify-center p-2 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 mx-auto">

          {sections.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;

            return (
              <button
                key={id}
                onClick={() => toggleSection(id)}
                className={`
                  flex items-center justify-center 
                  rounded-lg transition-all whitespace-nowrap

                  /* DESKTOP */
                  sm:flex sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm sm:font-medium
                  ${active 
                    ? 'sm:bg-blue-600 sm:text-white sm:shadow-lg sm:scale-105' 
                    : 'sm:bg-gray-800 sm:text-gray-300 sm:hover:bg-gray-700 sm:hover:text-white sm:hover:scale-105'
                  }

                  /* MOBILE */
                  px-3 py-2 sm:px-4
                  ${active 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={22} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};