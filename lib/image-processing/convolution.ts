// src/lib/image-processing/convolution.ts

import { Kernel } from '@/constants/kernels';

/**
 * Apply convolution operation to an image using a kernel matrix
 * @param imageData - Input image data
 * @param kernel - Kernel configuration with matrix, divisor, and offset
 * @returns Processed image data
 */
export const applyConvolution = (
  imageData: ImageData,
  kernel: Kernel
): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  
  const matrix = kernel.matrix;
  const kernelSize = matrix.length;
  const half = Math.floor(kernelSize / 2);
  const divisor = kernel.divisor || 1;
  const offset = kernel.offset || 0;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;

      // Apply kernel to neighborhood
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          // Calculate pixel position
          const px = x + kx - half;
          const py = y + ky - half;

          // Handle edge cases with clamping (replicate border pixels)
          const sampledX = Math.max(0, Math.min(width - 1, px));
          const sampledY = Math.max(0, Math.min(height - 1, py));
          
          const pixelIndex = (sampledY * width + sampledX) * 4;
          const weight = matrix[ky][kx];

          // Accumulate weighted values
          r += data[pixelIndex] * weight;
          g += data[pixelIndex + 1] * weight;
          b += data[pixelIndex + 2] * weight;
        }
      }

      // Apply divisor and offset, then clamp to valid range
      const outputIndex = (y * width + x) * 4;
      output[outputIndex] = Math.min(255, Math.max(0, r / divisor + offset));
      output[outputIndex + 1] = Math.min(255, Math.max(0, g / divisor + offset));
      output[outputIndex + 2] = Math.min(255, Math.max(0, b / divisor + offset));
      output[outputIndex + 3] = data[outputIndex + 3]; // Preserve alpha channel
    }
  }

  return new ImageData(output, width, height);
};

/**
 * Apply Sobel edge detection algorithm
 * Combines horizontal and vertical gradients to detect edges
 * @param imageData - Input image data
 * @returns Edge-detected image data
 */
export const applySobelEdgeDetection = (imageData: ImageData): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);

  // Sobel kernels for horizontal and vertical edge detection
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  // Process each pixel (skip borders for simplicity)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;

      // Apply both Sobel kernels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          
          // Use grayscale value (red channel or calculate luminance)
          const gray = data[pixelIndex];

          gx += gray * sobelX[ky + 1][kx + 1];
          gy += gray * sobelY[ky + 1][kx + 1];
        }
      }

      // Calculate gradient magnitude using Euclidean distance
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      
      // Clamp to valid range
      const value = Math.min(255, Math.max(0, magnitude));
      
      const outputIndex = (y * width + x) * 4;
      output[outputIndex] = value;
      output[outputIndex + 1] = value;
      output[outputIndex + 2] = value;
      output[outputIndex + 3] = 255; // Full opacity
    }
  }

  return new ImageData(output, width, height);
};

/**
 * Apply separable convolution (optimized for large kernels)
 * Separates 2D convolution into two 1D convolutions for better performance
 * @param imageData - Input image data
 * @param horizontalKernel - 1D horizontal kernel
 * @param verticalKernel - 1D vertical kernel
 * @returns Processed image data
 */
export const applySeparableConvolution = (
  imageData: ImageData,
  horizontalKernel: number[],
  verticalKernel: number[]
): ImageData => {
  const { width, height, data } = imageData;
  
  // First pass: horizontal convolution
  const temp = new Uint8ClampedArray(data.length);
  const hHalf = Math.floor(horizontalKernel.length / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let kx = 0; kx < horizontalKernel.length; kx++) {
        const px = Math.max(0, Math.min(width - 1, x + kx - hHalf));
        const idx = (y * width + px) * 4;
        const weight = horizontalKernel[kx];
        
        r += data[idx] * weight;
        g += data[idx + 1] * weight;
        b += data[idx + 2] * weight;
      }
      
      const idx = (y * width + x) * 4;
      temp[idx] = r;
      temp[idx + 1] = g;
      temp[idx + 2] = b;
      temp[idx + 3] = data[idx + 3];
    }
  }
  
  // Second pass: vertical convolution
  const output = new Uint8ClampedArray(data.length);
  const vHalf = Math.floor(verticalKernel.length / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let ky = 0; ky < verticalKernel.length; ky++) {
        const py = Math.max(0, Math.min(height - 1, y + ky - vHalf));
        const idx = (py * width + x) * 4;
        const weight = verticalKernel[ky];
        
        r += temp[idx] * weight;
        g += temp[idx + 1] * weight;
        b += temp[idx + 2] * weight;
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = Math.min(255, Math.max(0, r));
      output[idx + 1] = Math.min(255, Math.max(0, g));
      output[idx + 2] = Math.min(255, Math.max(0, b));
      output[idx + 3] = temp[idx + 3];
    }
  }
  
  return new ImageData(output, width, height);
};

/**
 * Create a Gaussian kernel for blur operations
 * @param size - Kernel size (must be odd)
 * @param sigma - Standard deviation (controls blur strength)
 * @returns Gaussian kernel configuration
 */
export const createGaussianKernel = (size: number, sigma: number): Kernel => {
  const matrix: number[][] = [];
  const half = Math.floor(size / 2);
  let sum = 0;

  for (let y = 0; y < size; y++) {
    matrix[y] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - half;
      const dy = y - half;
      const value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      matrix[y][x] = value;
      sum += value;
    }
  }

  // Normalize
  return {
    matrix,
    divisor: sum,
  };
};

/**
 * Apply unsharp masking for image sharpening
 * Subtracts a blurred version from the original to enhance edges
 * @param imageData - Input image data
 * @param amount - Sharpening strength (0-2, typical: 0.5-1.5)
 * @param radius - Blur radius (typical: 1-3)
 * @returns Sharpened image data
 */
export const applyUnsharpMask = (
  imageData: ImageData,
  amount: number = 1.0,
  radius: number = 1.0
): ImageData => {
  const { width, height, data } = imageData;
  
  // Create Gaussian blur kernel
  const kernel = createGaussianKernel(5, radius);
  const blurred = applyConvolution(imageData, kernel);
  
  // Subtract blurred from original and add back to original
  const output = new Uint8ClampedArray(data);
  
  for (let i = 0; i < data.length; i += 4) {
    output[i] = Math.min(255, Math.max(0, data[i] + amount * (data[i] - blurred.data[i])));
    output[i + 1] = Math.min(255, Math.max(0, data[i + 1] + amount * (data[i + 1] - blurred.data[i + 1])));
    output[i + 2] = Math.min(255, Math.max(0, data[i + 2] + amount * (data[i + 2] - blurred.data[i + 2])));
    output[i + 3] = data[i + 3];
  }
  
  return new ImageData(output, width, height);
};