// src/types/image.types.ts

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

// ============= NEW TYPES FOR FASE 7 & BATCH =============

export interface ZoomPanState {
  zoom: number;
  pan: { x: number; y: number };
}

export interface BeforeAfterState {
  enabled: boolean;
  splitPosition: number; // 0-100 percentage
}

export interface BatchImage {
  id: string;
  file: File;
  original: string;
  current: string;
  width: number;
  height: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface BatchOperation {
  type: string;
  params: Record<string, any>;
  timestamp: number;
}

export type ProcessingMode = 'single' | 'batch';

export interface CanvasTransform {
  scale: number;
  translateX: number;
  translateY: number;
}