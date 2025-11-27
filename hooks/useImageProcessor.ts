import { useImageStore } from '@/store/imageStore';
import { loadImageFromFile, validateImage } from '@/lib/utils/image-loader';
import { downloadImage, canvasToDataUrl } from '@/lib/utils/image-saver';
import { createCanvasFromImage } from '@/lib/utils/canvas-utils';
import { ImageFormat } from '@/types/image.types';

export const useImageProcessor = () => {
  const {
    imageData,
    setOriginalImage,
    setCurrentImage,
    resetToOriginal,
    addToHistory,
    setProcessing,
    clearAll,
  } = useImageStore();

  const handleUpload = async (file: File) => {
    const validation = validateImage(file);
    
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setProcessing(true);
    
    try {
      const { dataUrl, width, height } = await loadImageFromFile(file);
      setOriginalImage(dataUrl, file.name, width, height);
    } catch (error) {
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (format: ImageFormat = 'png') => {
    if (!imageData.current) {
      throw new Error('No image to download');
    }

    try {
      const canvas = await createCanvasFromImage(imageData.current);
      const dataUrl = canvasToDataUrl(canvas, format);
      downloadImage(dataUrl, imageData.fileName, format);
    } catch (error) {
      throw new Error('Failed to download image');
    }
  };

  const handleReset = () => {
    resetToOriginal();
  };

  const handleClear = () => {
    clearAll();
  };

  return {
    imageData,
    handleUpload,
    handleDownload,
    handleReset,
    handleClear,
  };
};

