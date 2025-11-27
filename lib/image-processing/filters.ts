// src/lib/image-processing/filters.ts

import { applyConvolution, applySobelEdgeDetection } from '@/lib/image-processing/convolution';
import { KERNELS } from '@/constants/kernels';

export const applyGaussianBlur = (
  imageData: ImageData,
  strength: 'light' | 'medium' | 'heavy' = 'medium'
): ImageData => {
  const kernel = strength === 'heavy' 
    ? KERNELS.GAUSSIAN_BLUR_5X5 as any
    : KERNELS.GAUSSIAN_BLUR_3X3 as any;
  
  return applyConvolution(imageData, kernel);
};

export const applyBoxBlur = (imageData: ImageData): ImageData => {
  return applyConvolution(imageData, KERNELS.BOX_BLUR as any);
};

export const applySharpen = (
  imageData: ImageData,
  strength: 'normal' | 'strong' = 'normal'
): ImageData => {
  const kernel = strength === 'strong' 
    ? KERNELS.SHARPEN_STRONG as any
    : KERNELS.SHARPEN as any;
  
  return applyConvolution(imageData, kernel);
};

export const applyEdgeDetection = (
  imageData: ImageData,
  method: 'sobel' | 'laplacian' | 'prewitt' = 'sobel'
): ImageData => {
  if (method === 'sobel') {
    return applySobelEdgeDetection(imageData);
  }
  
  const kernel = method === 'laplacian' 
    ? KERNELS.LAPLACIAN as any
    : KERNELS.PREWITT_X as any;
  
  return applyConvolution(imageData, kernel);
};

export const applyEmboss = (imageData: ImageData): ImageData => {
  return applyConvolution(imageData, KERNELS.EMBOSS as any);
};

export const applyMotionBlur = (imageData: ImageData): ImageData => {
  return applyConvolution(imageData, KERNELS.MOTION_BLUR as any);
};

// Custom kernel application
export const applyCustomKernel = (
  imageData: ImageData,
  matrix: number[][],
  divisor?: number,
  offset?: number
): ImageData => {
  return applyConvolution(imageData, { matrix, divisor, offset });
};