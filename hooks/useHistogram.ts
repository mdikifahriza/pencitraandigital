// src/hooks/useHistogram.ts

import { useState, useCallback, useEffect } from 'react';
import { useImageStore } from '@/store/imageStore';
import { createCanvasFromImage, getImageDataFromCanvas } from '@/lib/utils/canvas-utils';
import {
  calculateHistogram,
  histogramEqualization,
  histogramStretch,
  HistogramData,
} from '@/lib/image-processing/histogram';
import {
  globalThreshold,
  otsuThreshold,
  adaptiveThreshold,
} from '@/lib/image-processing/thresholding';

export const useHistogram = () => {
  const { imageData, setCurrentImage, addToHistory, setProcessing } = useImageStore();
  const [histogramData, setHistogramData] = useState<HistogramData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCurrentHistogram = useCallback(async () => {
    if (!imageData.current) {
      setHistogramData(null);
      return;
    }

    setIsCalculating(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      const imgData = getImageDataFromCanvas(canvas);
      if (imgData) {
        const histogram = calculateHistogram(imgData);
        setHistogramData(histogram);
      }
    } catch (error) {
      console.error('Error calculating histogram:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [imageData.current]);

  useEffect(() => {
    calculateCurrentHistogram();
  }, [calculateCurrentHistogram]);

  const applyHistogramEqualization = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      let imgData = getImageDataFromCanvas(canvas);
      if (!imgData) return;

      imgData = histogramEqualization(imgData);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImage(dataUrl);
        addToHistory(dataUrl, 'histogram-equalization');
      }
    } catch (error) {
      console.error('Error applying histogram equalization:', error);
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, setCurrentImage, addToHistory, setProcessing]);

  const applyHistogramStretch = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      let imgData = getImageDataFromCanvas(canvas);
      if (!imgData) return;

      imgData = histogramStretch(imgData);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImage(dataUrl);
        addToHistory(dataUrl, 'histogram-stretch');
      }
    } catch (error) {
      console.error('Error applying histogram stretch:', error);
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, setCurrentImage, addToHistory, setProcessing]);

  const applyGlobalThreshold = useCallback(
    async (threshold: number = 128) => {
      if (!imageData.current) return;

      setProcessing(true);
      try {
        const canvas = await createCanvasFromImage(imageData.current);
        let imgData = getImageDataFromCanvas(canvas);
        if (!imgData) return;

        imgData = globalThreshold(imgData, threshold);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setCurrentImage(dataUrl);
          addToHistory(dataUrl, `threshold-${threshold}`);
        }
      } catch (error) {
        console.error('Error applying threshold:', error);
      } finally {
        setProcessing(false);
      }
    },
    [imageData.current, setCurrentImage, addToHistory, setProcessing]
  );

  const applyOtsuThreshold = useCallback(async () => {
    if (!imageData.current) return;

    setProcessing(true);
    try {
      const canvas = await createCanvasFromImage(imageData.current);
      let imgData = getImageDataFromCanvas(canvas);
      if (!imgData) return;

      imgData = otsuThreshold(imgData);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCurrentImage(dataUrl);
        addToHistory(dataUrl, 'otsu-threshold');
      }
    } catch (error) {
      console.error('Error applying Otsu threshold:', error);
    } finally {
      setProcessing(false);
    }
  }, [imageData.current, setCurrentImage, addToHistory, setProcessing]);

  const applyAdaptiveThreshold = useCallback(
    async (blockSize: number = 11) => {
      if (!imageData.current) return;

      setProcessing(true);
      try {
        const canvas = await createCanvasFromImage(imageData.current);
        let imgData = getImageDataFromCanvas(canvas);
        if (!imgData) return;

        imgData = adaptiveThreshold(imgData, blockSize);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imgData, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setCurrentImage(dataUrl);
          addToHistory(dataUrl, 'adaptive-threshold');
        }
      } catch (error) {
        console.error('Error applying adaptive threshold:', error);
      } finally {
        setProcessing(false);
      }
    },
    [imageData.current, setCurrentImage, addToHistory, setProcessing]
  );

  return {
    histogramData,
    isCalculating,
    calculateCurrentHistogram,
    applyHistogramEqualization,
    applyHistogramStretch,
    applyGlobalThreshold,
    applyOtsuThreshold,
    applyAdaptiveThreshold,
  };
};
