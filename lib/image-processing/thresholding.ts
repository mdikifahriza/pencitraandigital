// src/lib/image-processing/thresholding.ts

export const globalThreshold = (
  imageData: ImageData,
  threshold: number = 128
): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    const binary = gray >= threshold ? 255 : 0;

    output[i] = binary;
    output[i + 1] = binary;
    output[i + 2] = binary;
  }

  return new ImageData(output, width, height);
};

export const otsuThreshold = (imageData: ImageData): ImageData => {
  const { width, height, data } = imageData;
  
  // Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    histogram[gray]++;
  }

  const totalPixels = width * height;
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;

    wF = totalPixels - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return globalThreshold(imageData, threshold);
};

export const adaptiveThreshold = (
  imageData: ImageData,
  blockSize: number = 11,
  constant: number = 2
): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const half = Math.floor(blockSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      // Calculate local mean
      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx));
          const ny = Math.max(0, Math.min(height - 1, y + dy));
          const idx = (ny * width + nx) * 4;
          
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          sum += gray;
          count++;
        }
      }

      const mean = sum / count;
      const idx = (y * width + x) * 4;
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const binary = gray >= (mean - constant) ? 255 : 0;

      output[idx] = binary;
      output[idx + 1] = binary;
      output[idx + 2] = binary;
    }
  }

  return new ImageData(output, width, height);
};