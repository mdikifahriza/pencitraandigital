export const createCanvasFromImage = (imageUrl: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

export const getImageDataFromCanvas = (canvas: HTMLCanvasElement): ImageData | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export const putImageDataToCanvas = (
  canvas: HTMLCanvasElement,
  imageData: ImageData
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.putImageData(imageData, 0, 0);
};
