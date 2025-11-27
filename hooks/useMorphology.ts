// src/hooks/useMorphology.ts

import { useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { createCanvasFromImage, getImageDataFromCanvas } from '@/lib/utils/canvas-utils';
import {
  erode,
  dilate,
  opening,
  closing,
  morphologicalGradient,
  createStructuringElement,
  StructuringElement,
} from '@/lib/image-processing/morphology';

export const useMorphology = () => {
  const { imageData, setCurrentImage, addToHistory, setProcessing } = useImageStore();

  const applyMorphology = useCallback(
    async (
      morphFn: (imgData: ImageData, se: StructuringElement) => ImageData,
      operationName: string,
      shape: 'square' | 'cross' | 'circle' = 'square',
      size: number = 3
    ) => {
      if (!imageData.current) return;

      setProcessing(true);
      try {
        const canvas = await createCanvasFromImage(imageData.current);
        let imgData = getImageDataFromCanvas(canvas);
        if (!imgData) return;

        const structuringElement = createStructuringElement(shape, size);
        imgData = morphFn(imgData, structuringElement);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setCurrentImage(dataUrl);
          addToHistory(dataUrl, `${operationName}-${shape}-${size}`);
        }
      } catch (error) {
        console.error(`Error applying ${operationName}:`, error);
      } finally {
        setProcessing(false);
      }
    },
    [imageData.current, setCurrentImage, addToHistory, setProcessing]
  );

  const applyErosion = useCallback(
    (shape: 'square' | 'cross' | 'circle' = 'square', size: number = 3) => {
      applyMorphology(erode, 'erosion', shape, size);
    },
    [applyMorphology]
  );

  const applyDilation = useCallback(
    (shape: 'square' | 'cross' | 'circle' = 'square', size: number = 3) => {
      applyMorphology(dilate, 'dilation', shape, size);
    },
    [applyMorphology]
  );

  const applyOpening = useCallback(
    (shape: 'square' | 'cross' | 'circle' = 'square', size: number = 3) => {
      applyMorphology(opening, 'opening', shape, size);
    },
    [applyMorphology]
  );

  const applyClosing = useCallback(
    (shape: 'square' | 'cross' | 'circle' = 'square', size: number = 3) => {
      applyMorphology(closing, 'closing', shape, size);
    },
    [applyMorphology]
  );

  const applyGradient = useCallback(
    (shape: 'square' | 'cross' | 'circle' = 'square', size: number = 3) => {
      applyMorphology(morphologicalGradient, 'gradient', shape, size);
    },
    [applyMorphology]
  );

  return {
    applyErosion,
    applyDilation,
    applyOpening,
    applyClosing,
    applyGradient,
  };
};