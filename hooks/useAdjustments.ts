import { useState, useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { createCanvasFromImage, getImageDataFromCanvas } from '@/lib/utils/canvas-utils';
import {
  applyBrightness,
  applyContrast,
  applySaturation,
  applyGrayscale,
  applyNegative,
} from '@/lib/image-processing/adjustments';
import { AdjustmentParams } from '@/types/filter.types';

export const useAdjustments = () => {
  const { imageData, setCurrentImage, addToHistory, setProcessing } = useImageStore();
  
  const [adjustments, setAdjustments] = useState<AdjustmentParams>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Apply adjustments dengan real-time preview
  const applyAdjustmentsToImage = useCallback(
    async (params: AdjustmentParams) => {
      if (!imageData.original) return;

      try {
        const canvas = await createCanvasFromImage(imageData.original);
        let imgData = getImageDataFromCanvas(canvas);
        if (!imgData) return;

        // Apply adjustments in order
        if (params.brightness !== 0) {
          imgData = applyBrightness(imgData, params.brightness);
        }
        if (params.contrast !== 0) {
          imgData = applyContrast(imgData, params.contrast);
        }
        if (params.saturation !== 0) {
          imgData = applySaturation(imgData, params.saturation);
        }

        // Put back to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setCurrentImage(dataUrl);
        }
      } catch (error) {
        console.error('Error applying adjustments:', error);
      }
    },
    [imageData.original, setCurrentImage]
  );

  // Update single adjustment
  const updateAdjustment = useCallback(
    (type: keyof AdjustmentParams, value: number) => {
      const newAdjustments = { ...adjustments, [type]: value };
      setAdjustments(newAdjustments);
      
      if (isPreviewMode) {
        applyAdjustmentsToImage(newAdjustments);
      }
    },
    [adjustments, isPreviewMode, applyAdjustmentsToImage]
  );

  // Apply and save to history
  const applyAndSave = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      addToHistory(imageData.current, 'adjustments');
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, addToHistory, setProcessing]);

  // Reset adjustments
  const resetAdjustments = useCallback(() => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
    
    if (imageData.original) {
      setCurrentImage(imageData.original);
    }
  }, [imageData.original, setCurrentImage]);

  // Toggle preview mode
  const togglePreview = useCallback((enabled: boolean) => {
    setIsPreviewMode(enabled);
    if (enabled) {
      applyAdjustmentsToImage(adjustments);
    } else {
      if (imageData.original) {
        setCurrentImage(imageData.original);
      }
    }
  }, [adjustments, applyAdjustmentsToImage, imageData.original, setCurrentImage]);

  // Quick filters
  const applyGrayscaleFilter = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      let imgData = getImageDataFromCanvas(canvas);
      if (!imgData) return;

      imgData = applyGrayscale(imgData);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImage(dataUrl);
        addToHistory(dataUrl, 'grayscale');
      }
    } catch (error) {
      console.error('Error applying grayscale:', error);
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, setCurrentImage, addToHistory, setProcessing]);

  const applyNegativeFilter = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      let imgData = getImageDataFromCanvas(canvas);
      if (!imgData) return;

      imgData = applyNegative(imgData);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImage(dataUrl);
        addToHistory(dataUrl, 'negative');
      }
    } catch (error) {
      console.error('Error applying negative:', error);
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, setCurrentImage, addToHistory, setProcessing]);

  return {
    adjustments,
    isPreviewMode,
    updateAdjustment,
    togglePreview,
    applyAndSave,
    resetAdjustments,
    applyGrayscaleFilter,
    applyNegativeFilter,
  };
};

