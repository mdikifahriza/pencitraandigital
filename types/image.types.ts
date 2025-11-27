export interface ImageData {
  original: string | null;
  current: string | null;
  width: number;
  height: number;
  fileName: string;
}

export interface ProcessingHistory {
  id: string;
  imageData: string;
  timestamp: number;
  operation: string;
}

export type ImageFormat = 'png' | 'jpeg' | 'webp';

