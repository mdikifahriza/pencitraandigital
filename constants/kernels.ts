// src/constants/kernels.ts

export interface Kernel {
  matrix: number[][];
  divisor?: number;
  offset?: number;
}

export const KERNELS = {
  // Gaussian Blur 3x3
  GAUSSIAN_BLUR_3X3: {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    divisor: 16,
  },

  // Gaussian Blur 5x5
  GAUSSIAN_BLUR_5X5: {
    matrix: [
      [1, 4, 6, 4, 1],
      [4, 16, 24, 16, 4],
      [6, 24, 36, 24, 6],
      [4, 16, 24, 16, 4],
      [1, 4, 6, 4, 1]
    ],
    divisor: 256,
  },

  // Box Blur 3x3
  BOX_BLUR: {
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    divisor: 9,
  },

  // Sharpen
  SHARPEN: {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
  },

  // Sharpen Strong
  SHARPEN_STRONG: {
    matrix: [
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1]
    ],
  },

  // Edge Detection - Sobel X
  SOBEL_X: {
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
  },

  // Edge Detection - Sobel Y
  SOBEL_Y: {
    matrix: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ],
  },

  // Edge Detection - Laplacian
  LAPLACIAN: {
    matrix: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ],
  },

  // Emboss
  EMBOSS: {
    matrix: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2]
    ],
    offset: 128,
  },

  // Motion Blur
  MOTION_BLUR: {
    matrix: [
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1]
    ],
    divisor: 9,
  },

  // Edge Detection - Prewitt X
  PREWITT_X: {
    matrix: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1]
    ],
  },

  // Edge Detection - Prewitt Y
  PREWITT_Y: {
    matrix: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1]
    ],
  },
} as const;

export type KernelType = keyof typeof KERNELS;