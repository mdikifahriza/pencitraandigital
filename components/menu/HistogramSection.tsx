// src/components/menu/HistogramSection.tsx

'use client';

import React, { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useHistogram } from '@/hooks/useHistogram';
import { useImageStore } from '@/store/imageStore';

export const HistogramSection: React.FC = () => {
  const { imageData, isProcessing } = useImageStore();
  const {
    applyHistogramEqualization,
    applyHistogramStretch,
    applyGlobalThreshold,
    applyOtsuThreshold,
    applyAdaptiveThreshold,
  } = useHistogram();

  const [thresholdValue, setThresholdValue] = useState(128);
  const [blockSize, setBlockSize] = useState(11);

  const hasImage = !!imageData.current;

  return (
    <Accordion title="Histogram & Threshold" defaultOpen={false}>
      {/* Histogram Operations */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Histogram Operations
        </p>

        <Button
          onClick={applyHistogramEqualization}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Histogram Equalization
        </Button>

        <Button
          onClick={applyHistogramStretch}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Histogram Stretch
        </Button>
      </div>

      {/* Thresholding */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Thresholding
        </p>

        <Slider
          label="Global Threshold"
          value={thresholdValue}
          min={0}
          max={255}
          onChange={setThresholdValue}
          disabled={!hasImage || isProcessing}
        />

        <Button
          onClick={() => applyGlobalThreshold(thresholdValue)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Apply Global Threshold
        </Button>

        <Button
          onClick={applyOtsuThreshold}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Otsu's Threshold (Auto)
        </Button>

        <Slider
          label="Adaptive Block Size"
          value={blockSize}
          min={3}
          max={31}
          step={2}
          onChange={setBlockSize}
          disabled={!hasImage || isProcessing}
        />

        <Button
          onClick={() => applyAdaptiveThreshold(blockSize)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          Adaptive Threshold
        </Button>
      </div>
    </Accordion>
  );
};