import { create } from 'zustand';
import { ImageData, ProcessingHistory } from '@/types/image.types';

interface ImageStore {
  imageData: ImageData;
  history: ProcessingHistory[];
  historyIndex: number;
  isProcessing: boolean;
  
  setOriginalImage: (imageUrl: string, fileName: string, width: number, height: number) => void;
  setCurrentImage: (imageUrl: string) => void;
  resetToOriginal: () => void;
  addToHistory: (imageData: string, operation: string) => void;
  setProcessing: (status: boolean) => void;
  clearAll: () => void;
}

export const useImageStore = create<ImageStore>((set, get) => ({
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
      }));
    }
  },

  addToHistory: (imageData, operation) => {
    set((state) => ({
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          id: Date.now().toString(),
          imageData,
          timestamp: Date.now(),
          operation,
        },
      ],
      historyIndex: state.historyIndex + 1,
    }));
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
    });
  },
}));
