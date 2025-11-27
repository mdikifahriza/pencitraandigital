// src/components/menu/MorphologySection.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useMorphology } from '@/hooks/useMorphology';
import { useImageStore } from '@/store/imageStore';

export const MorphologySection: React.FC = () => {
  const { imageData, isProcessing, mode, batchImages } = useImageStore();
  const {
    applyErosion,
    applyDilation,
    applyOpening,
    applyClosing,
    applyGradient,
  } = useMorphology();

  const [shape, setShape] = useState<'square' | 'cross' | 'circle'>('square');
  const [kernelSize, setKernelSize] = useState(3);

  const hasImage = mode === 'batch' ? batchImages.length > 0 : !!imageData.current;

  return (
    <div className="space-y-4">
      {/* Batch Mode Info */}
      {mode === 'batch' && batchImages.length > 0 && (
        <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded text-xs text-blue-400">
          <strong>Batch Mode:</strong> Operation will apply to all {batchImages.length} images
        </div>
      )}

      {/* Structuring Element Settings */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          Structuring Element
        </p>

        <div className="flex gap-1">
          {(['square', 'cross', 'circle'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              disabled={!hasImage || isProcessing}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${
                shape === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Slider
          label="Kernel Size"
          value={kernelSize}
          min={3}
          max={9}
          step={2}
          onChange={setKernelSize}
          disabled={!hasImage || isProcessing}
        />
      </div>

      {/* Basic Operations */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          Basic Operations
        </p>

        <Button
          onClick={() => applyErosion(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Erosion (All)' : 'Erosion'}
        </Button>

        <Button
          onClick={() => applyDilation(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Dilation (All)' : 'Dilation'}
        </Button>
      </div>

      {/* Advanced Operations */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          Advanced Operations
        </p>

        <Button
          onClick={() => applyOpening(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Opening (All)' : 'Opening (Erode → Dilate)'}
        </Button>

        <Button
          onClick={() => applyClosing(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Closing (All)' : 'Closing (Dilate → Erode)'}
        </Button>

        <Button
          onClick={() => applyGradient(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Morphological Gradient (All)' : 'Morphological Gradient'}
        </Button>
      </div>

      {/* Info */}
      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          💡 Tip: Convert to grayscale first for better morphology results
        </p>
      </div>

      {isProcessing && mode === 'batch' && (
        <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded animate-pulse">
          Processing batch... Please wait
        </div>
      )}
    </div>
  );
};