'use client';

import React from 'react';
import { Eye, EyeOff, RotateCcw, Check } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useAdjustments } from '@/hooks/useAdjustments';
import { useImageStore } from '@/store/imageStore';

export const AdjustmentSection: React.FC = () => {
  const { imageData, isProcessing } = useImageStore();
  const {
    adjustments,
    isPreviewMode,
    updateAdjustment,
    togglePreview,
    applyAndSave,
    resetAdjustments,
    applyGrayscaleFilter,
    applyNegativeFilter,
  } = useAdjustments();

  const hasImage = !!imageData.current;
  const hasChanges = adjustments.brightness !== 0 || 
                     adjustments.contrast !== 0 || 
                     adjustments.saturation !== 0;

  return (
    <Accordion title="Adjustments" defaultOpen={true}>
      {/* Preview Toggle */}
      <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
        <span className="text-xs text-gray-400">Real-time Preview</span>
        <button
          onClick={() => togglePreview(!isPreviewMode)}
          disabled={!hasImage || isProcessing}
          className={`p-1.5 rounded transition-colors ${
            isPreviewMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPreviewMode ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* Sliders */}
      <Slider
        label="Brightness"
        value={adjustments.brightness}
        min={-100}
        max={100}
        onChange={(value) => updateAdjustment('brightness', value)}
        disabled={!hasImage || isProcessing}
      />

      <Slider
        label="Contrast"
        value={adjustments.contrast}
        min={-100}
        max={100}
        onChange={(value) => updateAdjustment('contrast', value)}
        disabled={!hasImage || isProcessing}
      />

      <Slider
        label="Saturation"
        value={adjustments.saturation}
        min={-100}
        max={100}
        onChange={(value) => updateAdjustment('saturation', value)}
        disabled={!hasImage || isProcessing}
      />

      {/* Apply/Reset Buttons */}
      {hasChanges && (
        <div className="flex gap-2 pt-2 border-t border-gray-700">
          <Button
            onClick={applyAndSave}
            variant="primary"
            size="sm"
            disabled={!hasImage || isProcessing}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <Check size={14} />
            Apply
          </Button>
          <Button
            onClick={resetAdjustments}
            variant="secondary"
            size="sm"
            disabled={!hasImage || isProcessing}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      )}

      {/* Quick Filters */}
      <div className="pt-3 border-t border-gray-700 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Quick Filters</p>
        
        <Button
          onClick={applyGrayscaleFilter}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Grayscale
        </Button>

        <Button
          onClick={applyNegativeFilter}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Negative
        </Button>
      </div>
    </Accordion>
  );
};

