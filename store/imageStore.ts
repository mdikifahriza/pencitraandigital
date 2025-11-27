// src/store/imageStore.ts

import { create } from 'zustand';
import { 
  ImageData, 
  ProcessingHistory, 
  ZoomPanState, 
  BeforeAfterState,
  BatchImage,
  ProcessingMode 
} from '@/types/image.types';
import { loadImageToCanvas, canvasToDataURL } from '@/lib/batch/batch-processor';

interface ImageStore {
  // Single Image State
  imageData: ImageData;
  history: ProcessingHistory[];
  historyIndex: number;
  isProcessing: boolean;
  
  // Zoom & Pan
  zoomPan: ZoomPanState;
  
  // Before/After
  beforeAfter: BeforeAfterState;
  
  // Batch Processing
  mode: ProcessingMode;
  batchImages: BatchImage[];
  currentBatchIndex: number;
  
  // Single Image Actions
  setOriginalImage: (imageUrl: string, fileName: string, width: number, height: number) => void;
  setCurrentImage: (imageUrl: string) => void;
  resetToOriginal: () => void;
  addToHistory: (imageData: string, operation: string) => void;
  setProcessing: (status: boolean) => void;
  clearAll: () => void;
  
  // History Actions (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Zoom & Pan Actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPan: (x: number, y: number) => void;
  resetPan: () => void;
  
  // Before/After Actions
  toggleBeforeAfter: () => void;
  setBeforeAfterPosition: (position: number) => void;
  
  // Batch Processing Actions
  setMode: (mode: ProcessingMode) => void;
  addBatchImages: (files: File[]) => Promise<void>;
  removeBatchImage: (id: string) => void;
  clearBatch: () => void;
  setCurrentBatchIndex: (index: number) => void;
  updateBatchImage: (id: string, updates: Partial<BatchImage>) => void;
  processBatchOperation: (processFunc: (canvas: HTMLCanvasElement) => void, operationName: string) => Promise<void>;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  // Initial State
  imageData: {
    original: null,
    current: null,
    width: 0,
    height: 0,
    fileName: '',
  },
  history: [],
  historyIndex: -1,
  isProcessing: false,
  
  zoomPan: {
    zoom: 1,
    pan: { x: 0, y: 0 },
  },
  
  beforeAfter: {
    enabled: false,
    splitPosition: 50,
  },
  
  mode: 'single',
  batchImages: [],
  currentBatchIndex: 0,

  // ========== SINGLE IMAGE ACTIONS ==========
  
  setOriginalImage: (imageUrl, fileName, width, height) => {
    set({
      imageData: {
        original: imageUrl,
        current: imageUrl,
        width,
        height,
        fileName,
      },
      history: [{
        id: Date.now().toString(),
        imageData: imageUrl,
        timestamp: Date.now(),
        operation: 'original',
      }],
      historyIndex: 0,
    });
  },

  setCurrentImage: (imageUrl) => {
    set((state) => ({
      imageData: {
        ...state.imageData,
        current: imageUrl,
      },
    }));
  },

  resetToOriginal: () => {
    const { imageData } = get();
    if (imageData.original) {
      set((state) => ({
        imageData: {
          ...state.imageData,
          current: imageData.original,
        },
        historyIndex: 0,
      }));
    }
  },

  addToHistory: (imageData, operation) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        history: [
          ...newHistory,
          {
            id: Date.now().toString(),
            imageData,
            timestamp: Date.now(),
            operation,
          },
        ],
        historyIndex: state.historyIndex + 1,
        imageData: {
          ...state.imageData,
          current: imageData,
        },
      };
    });
  },

  setProcessing: (status) => set({ isProcessing: status }),

  clearAll: () => {
    set({
      imageData: {
        original: null,
        current: null,
        width: 0,
        height: 0,
        fileName: '',
      },
      history: [],
      historyIndex: -1,
      isProcessing: false,
      zoomPan: {
        zoom: 1,
        pan: { x: 0, y: 0 },
      },
      beforeAfter: {
        enabled: false,
        splitPosition: 50,
      },
    });
  },

  // ========== HISTORY ACTIONS (UNDO/REDO) ==========
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set((state) => ({
        historyIndex: newIndex,
        imageData: {
          ...state.imageData,
          current: history[newIndex].imageData,
        },
      }));
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set((state) => ({
        historyIndex: newIndex,
        imageData: {
          ...state.imageData,
          current: history[newIndex].imageData,
        },
      }));
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // ========== ZOOM & PAN ACTIONS ==========
  
  setZoom: (zoom) => {
    set((state) => ({
      zoomPan: {
        ...state.zoomPan,
        zoom: Math.max(0.1, Math.min(5, zoom)),
      },
    }));
  },

  zoomIn: () => {
    const { zoomPan } = get();
    get().setZoom(zoomPan.zoom + 0.1);
  },

  zoomOut: () => {
    const { zoomPan } = get();
    get().setZoom(zoomPan.zoom - 0.1);
  },

  resetZoom: () => {
    set((state) => ({
      zoomPan: {
        ...state.zoomPan,
        zoom: 1,
      },
    }));
  },

  setPan: (x, y) => {
    set((state) => ({
      zoomPan: {
        ...state.zoomPan,
        pan: { x, y },
      },
    }));
  },

  resetPan: () => {
    set((state) => ({
      zoomPan: {
        ...state.zoomPan,
        pan: { x: 0, y: 0 },
      },
    }));
  },

  // ========== BEFORE/AFTER ACTIONS ==========
  
  toggleBeforeAfter: () => {
    set((state) => ({
      beforeAfter: {
        ...state.beforeAfter,
        enabled: !state.beforeAfter.enabled,
      },
    }));
  },

  setBeforeAfterPosition: (position) => {
    set((state) => ({
      beforeAfter: {
        ...state.beforeAfter,
        splitPosition: Math.max(0, Math.min(100, position)),
      },
    }));
  },

  // ========== BATCH PROCESSING ACTIONS ==========
  
  setMode: (mode) => {
    set({ mode });
    if (mode === 'single') {
      set({ batchImages: [], currentBatchIndex: 0 });
    }
  },

  addBatchImages: async (files) => {
    const newImages: BatchImage[] = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const img = await new Promise<HTMLImageElement>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve(image);
          image.src = imageUrl;
        });

        return {
          id: `${Date.now()}-${Math.random()}`,
          file,
          original: imageUrl,
          current: imageUrl,
          width: img.width,
          height: img.height,
          status: 'pending',
          progress: 0,
        } as BatchImage;
      })
    );

    set((state) => ({
      batchImages: [...state.batchImages, ...newImages],
    }));
  },

  removeBatchImage: (id) => {
    set((state) => ({
      batchImages: state.batchImages.filter((img) => img.id !== id),
    }));
  },

  clearBatch: () => {
    set({ batchImages: [], currentBatchIndex: 0 });
  },

  setCurrentBatchIndex: (index) => {
    set({ currentBatchIndex: index });
  },

  updateBatchImage: (id, updates) => {
    set((state) => ({
      batchImages: state.batchImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    }));
  },

  processBatchOperation: async (processFunc, operationName) => {
    const { batchImages } = get();
    
    if (batchImages.length === 0) {
      console.warn('No images in batch to process');
      return;
    }

    for (let i = 0; i < batchImages.length; i++) {
      const image = batchImages[i];
      
      try {
        // Update status: processing
        get().updateBatchImage(image.id, { 
          status: 'processing', 
          progress: 0 
        });
        
        // Load image to canvas
        const canvas = await loadImageToCanvas(image.current);
        
        // Update progress
        get().updateBatchImage(image.id, { progress: 30 });
        
        // Apply processing function
        processFunc(canvas);
        
        // Update progress
        get().updateBatchImage(image.id, { progress: 70 });
        
        // Convert back to data URL
        const processedImageUrl = canvasToDataURL(canvas, 'png');
        
        // Update with result
        get().updateBatchImage(image.id, { 
          current: processedImageUrl,
          status: 'completed', 
          progress: 100 
        });
        
      } catch (error) {
        console.error(`Error processing image ${image.id}:`, error);
        get().updateBatchImage(image.id, { 
          status: 'error',
          error: error instanceof Error ? error.message : 'Processing failed',
        });
      }
    }
  },
}));