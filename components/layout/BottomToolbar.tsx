'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Sun, 
  Filter, 
  BarChart3, 
  Shapes,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { FileSection } from '@/components/menu/FileSection';
import { AdjustmentSection } from '@/components/menu/AdjustmentSection';
import { FilterSection } from '@/components/menu/FilterSection';
import { HistogramSection } from '@/components/menu/HistogramSection';
import { MorphologySection } from '@/components/menu/MorphologySection';
import { useImageStore } from '@/store/imageStore';

type ToolbarSection = 'file' | 'adjustment' | 'filter' | 'histogram' | 'morphology' | null;

export const BottomToolbar: React.FC = () => {
  const { mode, batchImages } = useImageStore();
  const [activeSection, setActiveSection] = useState<ToolbarSection>(null);

  const toggleSection = (section: ToolbarSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const closeSection = () => {
    setActiveSection(null);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSection();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Determine panel max height based on mode
  const panelMaxHeight = mode === 'batch' ? 'max-h-[45vh]' : 'max-h-[55vh]';

  const sections = [
    { id: 'file' as const, label: 'File', icon: Upload },
    { id: 'adjustment' as const, label: 'Adjustments', icon: Sun },
    { id: 'filter' as const, label: 'Filters', icon: Filter },
    { id: 'histogram' as const, label: 'Histogram', icon: BarChart3 },
    { id: 'morphology' as const, label: 'Morphology', icon: Shapes },
  ];

  return (
    <div className="relative bg-gray-900 border-t border-gray-700 z-30">
      {/* Expandable Panel */}
      {activeSection && (
        <div className={`absolute bottom-full left-0 right-0 border-t border-gray-700 bg-gray-800 ${panelMaxHeight} overflow-y-auto custom-scrollbar shadow-2xl animate-slide-up`}>
          <div className="max-w-7xl mx-auto">
            {/* Panel Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                {mode === 'batch' && batchImages.length > 0 && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full font-medium">
                    Apply to {batchImages.length} images
                  </span>
                )}
              </div>
              <button
                onClick={closeSection}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Close panel"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-4">
              {activeSection === 'file' && <FileSection />}
              {activeSection === 'adjustment' && <AdjustmentSection />}
              {activeSection === 'filter' && <FilterSection />}
              {activeSection === 'histogram' && <HistogramSection />}
              {activeSection === 'morphology' && <MorphologySection />}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar Buttons */}
      <div className="flex items-center justify-center gap-1 p-2 overflow-x-auto custom-scrollbar">
        <div className="flex gap-1 mx-auto">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggleSection(id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeSection === id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }
              `}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
              {activeSection === id ? (
                <ChevronDown size={16} className="ml-1" />
              ) : (
                <ChevronUp size={16} className="ml-1 opacity-50" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Hint */}
      {activeSection && (
        <div className="lg:hidden px-4 pb-2 text-center">
          <p className="text-xs text-gray-500">
            Press ESC to close
          </p>
        </div>
      )}
    </div>
  );
};