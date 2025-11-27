// src/lib/batch/batch-processor.ts

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BatchImage } from '@/types/image.types';

/**
 * Load image from URL to canvas
 */
export const loadImageToCanvas = (imageUrl: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

/**
 * Convert canvas to data URL
 */
export const canvasToDataURL = (canvas: HTMLCanvasElement, format: 'png' | 'jpeg' = 'png'): string => {
  return canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);
};

/**
 * Convert base64 to Blob
 */
export const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Export batch images as ZIP file
 */
export const exportBatchAsZip = async (
  batchImages: BatchImage[],
  filename: string = 'batch-results.zip'
): Promise<void> => {
  try {
    const zip = new JSZip();
    const completedImages = batchImages.filter(img => img.status === 'completed');

    if (completedImages.length === 0) {
      throw new Error('No completed images to export');
    }

    // Add each image to ZIP
    completedImages.forEach((img, index) => {
      const blob = base64ToBlob(img.current);
      const extension = img.file.name.split('.').pop() || 'png';
      const fileName = `processed-${index + 1}-${img.file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      zip.file(fileName, blob);
    });

    // Generate and download ZIP
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    saveAs(content, filename);
  } catch (error) {
    console.error('Error exporting batch as ZIP:', error);
    throw error;
  }
};

/**
 * Get image dimensions from data URL
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` 
    };
  }

  return { valid: true };
};

/**
 * Process image with retry logic
 */
export const processWithRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Processing failed after retries');
};