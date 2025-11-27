// src/components/menu/MorphologySection.tsx

'use client';

import React, { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useMorphology } from '@/hooks/useMorphology';
import { useImageStore } from '@/store/imageStore';

export const MorphologySection: React.FC = () => {
  const { imageData, isProcessing } = useImageStore();
  const {
    applyErosion,
    applyDilation,
    applyOpening,
    applyClosing,
    applyGradient,
  } = useMorphology();

  const [shape, setShape] = useState<'square' | 'cross' | 'circle'>('square');
  const [kernelSize, setKernelSize] = useState(3);

  const hasImage = !!imageData.current;

  return (
    <Accordion title="Morphology" defaultOpen={false}>
      {/* Structuring Element Settings */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
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
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Basic Operations
        </p>

        <Button
          onClick={() => applyErosion(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Erosion
        </Button>

        <Button
          onClick={() => applyDilation(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Dilation
        </Button>
      </div>

      {/* Advanced Operations */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Advanced Operations
        </p>

        <Button
          onClick={() => applyOpening(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Opening (Erode → Dilate)
        </Button>

        <Button
          onClick={() => applyClosing(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Closing (Dilate → Erode)
        </Button>

        <Button
          onClick={() => applyGradient(shape, kernelSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Morphological Gradient
        </Button>
      </div>

      {/* Info */}
      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          💡 Tip: Convert to grayscale first for better morphology results
        </p>
      </div>
    </Accordion>
  );
};