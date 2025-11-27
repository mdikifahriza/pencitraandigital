'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useHistogram } from '@/hooks/useHistogram';
import { useImageStore } from '@/store/imageStore';

export const HistogramSection: React.FC = () => {
  const { imageData, isProcessing, mode, batchImages } = useImageStore();
  const {
    applyHistogramEqualization,
    applyHistogramStretch,
    applyGlobalThreshold,
    applyOtsuThreshold,
    applyAdaptiveThreshold,
  } = useHistogram();

  const [thresholdValue, setThresholdValue] = useState(128);
  const [blockSize, setBlockSize] = useState(11);

  const hasImage = mode === 'batch' ? batchImages.length > 0 : !!imageData.current;

  return (
    <div className="space-y-4">
      {/* Batch Mode Info */}
      {mode === 'batch' && batchImages.length > 0 && (
        <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded text-xs text-blue-400">
          <strong>Batch Mode:</strong> Operation will apply to all {batchImages.length} images
        </div>
      )}

      {/* Histogram Operations */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          Histogram Operations
        </p>

        <Button
          onClick={applyHistogramEqualization}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Histogram Equalization (All)' : 'Histogram Equalization'}
        </Button>

        <Button
          onClick={applyHistogramStretch}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Histogram Stretch (All)' : 'Histogram Stretch'}
        </Button>
      </div>

      {/* Thresholding */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
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
          {mode === 'batch' ? 'Apply Global Threshold (All)' : 'Apply Global Threshold'}
        </Button>

        <Button
          onClick={applyOtsuThreshold}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? "Otsu's Threshold (All)" : "Otsu's Threshold (Auto)"}
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
          {mode === 'batch' ? 'Adaptive Threshold (All)' : 'Adaptive Threshold'}
        </Button>
      </div>

      {isProcessing && mode === 'batch' && (
        <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded animate-pulse">
          Processing batch... Please wait
        </div>
      )}
    </div>
  );
};