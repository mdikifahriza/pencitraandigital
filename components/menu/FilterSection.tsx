// src/components/menu/FilterSection.tsx

'use client';

import React, { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { useFilters } from '@/hooks/useFilters';
import { useImageStore } from '@/store/imageStore';

export const FilterSection: React.FC = () => {
  const { imageData, isProcessing, mode, batchImages } = useImageStore();
  const { gaussianBlur, sharpen, edgeDetection, emboss, motionBlur } = useFilters();
  
  const [blurStrength, setBlurStrength] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [sharpenStrength, setSharpenStrength] = useState<'normal' | 'strong'>('normal');
  const [edgeMethod, setEdgeMethod] = useState<'sobel' | 'laplacian' | 'prewitt'>('sobel');

  const hasImage = mode === 'batch' ? batchImages.length > 0 : !!imageData.current;

  return (
    <Accordion title="Filters" defaultOpen={false}>
      {/* Batch Mode Info */}
      {mode === 'batch' && batchImages.length > 0 && (
        <div className="mb-3 p-2 bg-blue-900/20 border border-blue-800/30 rounded text-xs text-blue-400">
          <strong>Batch Mode:</strong> Filter will apply to all {batchImages.length} images
        </div>
      )}

      {/* Blur Section */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Blur</p>
        
        <div className="flex gap-1 mb-2">
          {(['light', 'medium', 'heavy'] as const).map((strength) => (
            <button
              key={strength}
              onClick={() => setBlurStrength(strength)}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                blurStrength === strength
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {strength}
            </button>
          ))}
        </div>

        <Button
          onClick={() => gaussianBlur(blurStrength)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Gaussian Blur (All)' : 'Gaussian Blur'}
        </Button>

        <Button
          onClick={() => motionBlur()}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Motion Blur (All)' : 'Motion Blur'}
        </Button>
      </div>

      {/* Sharpen Section */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Sharpen</p>
        
        <div className="flex gap-1 mb-2">
          {(['normal', 'strong'] as const).map((strength) => (
            <button
              key={strength}
              onClick={() => setSharpenStrength(strength)}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                sharpenStrength === strength
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {strength}
            </button>
          ))}
        </div>

        <Button
          onClick={() => sharpen(sharpenStrength)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Sharpen (All)' : 'Sharpen'}
        </Button>
      </div>

      {/* Edge Detection Section */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Edge Detection</p>
        
        <div className="flex gap-1 mb-2">
          {(['sobel', 'laplacian', 'prewitt'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setEdgeMethod(method)}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                edgeMethod === method
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <Button
          onClick={() => edgeDetection(edgeMethod)}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Detect Edges (All)' : 'Detect Edges'}
        </Button>
      </div>

      {/* Other Effects */}
      <div className="space-y-2 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Effects</p>
        
        <Button
          onClick={() => emboss()}
          variant="secondary"
          size="sm"
          disabled={!hasImage || isProcessing}
          className="w-full"
        >
          {mode === 'batch' ? 'Emboss (All)' : 'Emboss'}
        </Button>
      </div>

      {isProcessing && mode === 'batch' && (
        <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded animate-pulse">
          Processing batch... Please wait
        </div>
      )}
    </Accordion>
  );
};