// src/lib/image-processing/morphology.ts

export type StructuringElement = number[][];

export const createStructuringElement = (
  shape: 'square' | 'cross' | 'circle',
  size: number = 3
): StructuringElement => {
  const element: StructuringElement = [];
  const center = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    element[i] = [];
    for (let j = 0; j < size; j++) {
      if (shape === 'square') {
        element[i][j] = 1;
      } else if (shape === 'cross') {
        element[i][j] = (i === center || j === center) ? 1 : 0;
      } else if (shape === 'circle') {
        const dist = Math.sqrt((i - center) ** 2 + (j - center) ** 2);
        element[i][j] = dist <= center ? 1 : 0;
      }
    }
  }

  return element;
};

export const erode = (
  imageData: ImageData,
  structuringElement: StructuringElement = createStructuringElement('square', 3)
): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const size = structuringElement.length;
  const half = Math.floor(size / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minValue = 255;

      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          if (structuringElement[ky][kx] === 0) continue;

          const nx = Math.max(0, Math.min(width - 1, x + kx - half));
          const ny = Math.max(0, Math.min(height - 1, y + ky - half));
          const idx = (ny * width + nx) * 4;

          minValue = Math.min(minValue, data[idx]);
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = minValue;
      output[idx + 1] = minValue;
      output[idx + 2] = minValue;
    }
  }

  return new ImageData(output, width, height);
};

export const dilate = (
  imageData: ImageData,
  structuringElement: StructuringElement = createStructuringElement('square', 3)
): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const size = structuringElement.length;
  const half = Math.floor(size / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxValue = 0;

      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          if (structuringElement[ky][kx] === 0) continue;

          const nx = Math.max(0, Math.min(width - 1, x + kx - half));
          const ny = Math.max(0, Math.min(height - 1, y + ky - half));
          const idx = (ny * width + nx) * 4;

          maxValue = Math.max(maxValue, data[idx]);
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = maxValue;
      output[idx + 1] = maxValue;
      output[idx + 2] = maxValue;
    }
  }

  return new ImageData(output, width, height);
};

export const opening = (
  imageData: ImageData,
  structuringElement: StructuringElement = createStructuringElement('square', 3)
): ImageData => {
  // Opening = Erosion followed by Dilation
  const eroded = erode(imageData, structuringElement);
  return dilate(eroded, structuringElement);
};

export const closing = (
  imageData: ImageData,
  structuringElement: StructuringElement = createStructuringElement('square', 3)
): ImageData => {
  // Closing = Dilation followed by Erosion
  const dilated = dilate(imageData, structuringElement);
  return erode(dilated, structuringElement);
};

export const morphologicalGradient = (
  imageData: ImageData,
  structuringElement: StructuringElement = createStructuringElement('square', 3)
): ImageData => {
  const { width, height } = imageData;
  const dilated = dilate(imageData, structuringElement);
  const eroded = erode(imageData, structuringElement);
  const output = new Uint8ClampedArray(dilated.data.length);

  for (let i = 0; i < output.length; i += 4) {
    const diff = dilated.data[i] - eroded.data[i];
    output[i] = diff;
    output[i + 1] = diff;
    output[i + 2] = diff;
    output[i + 3] = 255;
  }

  return new ImageData(output, width, height);
};