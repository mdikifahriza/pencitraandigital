import { ImageFormat } from '@/types/image.types';

export const downloadImage = (
  dataUrl: string,
  fileName: string,
  format: ImageFormat = 'png'
) => {
  const link = document.createElement('a');
  const timestamp = new Date().getTime();
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  link.download = `${nameWithoutExt}_processed_${timestamp}.${format}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const canvasToDataUrl = (
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'png',
  quality: number = 0.92
): string => {
  const mimeType = `image/${format}`;
  return canvas.toDataURL(mimeType, quality);
};
