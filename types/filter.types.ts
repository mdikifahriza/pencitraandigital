export interface AdjustmentParams {
  brightness: number;
  contrast: number;
  saturation: number;
}

export type AdjustmentType = 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'negative';

