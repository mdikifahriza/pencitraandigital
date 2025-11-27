// src/hooks/useFilters.ts

import { useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { createCanvasFromImage, getImageDataFromCanvas } from '@/lib/utils/canvas-utils';
import {
  applyGaussianBlur,
  applySharpen,
  applyEdgeDetection,
  applyEmboss,
  applyMotionBlur,
} from '@/lib/image-processing/filters';

export const useFilters = () => {
  const { imageData, setCurrentImage, addToHistory, setProcessing } = useImageStore();

  const applyFilter = useCallback(
    async (
      filterFn: (imgData: ImageData) => ImageData,
      filterName: string
    ) => {
      if (!imageData.current) return;

      setProcessing(true);
      try {
        const canvas = await createCanvasFromImage(imageData.current);
        let imgData = getImageDataFromCanvas(canvas);
        if (!imgData) return;

        imgData = filterFn(imgData);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setCurrentImage(dataUrl);
          addToHistory(dataUrl, filterName);
        }
      } catch (error) {
        console.error(`Error applying ${filterName}:`, error);
      } finally {
        setProcessing(false);
      }
    },
    [imageData.current, setCurrentImage, addToHistory, setProcessing]
  );

  const gaussianBlur = useCallback(
    (strength: 'light' | 'medium' | 'heavy' = 'medium') => {
      applyFilter(
        (imgData) => applyGaussianBlur(imgData, strength),
        `gaussian-blur-${strength}`
      );
    },
    [applyFilter]
  );

  const sharpen = useCallback(
    (strength: 'normal' | 'strong' = 'normal') => {
      applyFilter(
        (imgData) => applySharpen(imgData, strength),
        `sharpen-${strength}`
      );
    },
    [applyFilter]
  );

  const edgeDetection = useCallback(
    (method: 'sobel' | 'laplacian' | 'prewitt' = 'sobel') => {
      applyFilter(
        (imgData) => applyEdgeDetection(imgData, method),
        `edge-${method}`
      );
    },
    [applyFilter]
  );

  const emboss = useCallback(() => {
    applyFilter(
      (imgData) => applyEmboss(imgData),
      'emboss'
    );
  }, [applyFilter]);

  const motionBlur = useCallback(() => {
    applyFilter(
      (imgData) => applyMotionBlur(imgData),
      'motion-blur'
    );
  }, [applyFilter]);

  return {
    gaussianBlur,
    sharpen,
    edgeDetection,
    emboss,
    motionBlur,
  };
};