export const applyBrightness = (
  imageData: ImageData,
  brightness: number // -100 to 100
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] + brightness;     // R
    data[i + 1] = data[i + 1] + brightness; // G
    data[i + 2] = data[i + 2] + brightness; // B
    // Alpha (i + 3) tidak diubah
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const applyContrast = (
  imageData: ImageData,
  contrast: number // -100 to 100
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;         // R
    data[i + 1] = factor * (data[i + 1] - 128) + 128; // G
    data[i + 2] = factor * (data[i + 2] - 128) + 128; // B
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const applyGrayscale = (imageData: ImageData): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    // Luminosity method (lebih akurat dari average)
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const applyNegative = (imageData: ImageData): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];         // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};

export const applySaturation = (
  imageData: ImageData,
  saturation: number // -100 to 100
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (saturation + 100) / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    data[i] = gray + factor * (data[i] - gray);
    data[i + 1] = gray + factor * (data[i + 1] - gray);
    data[i + 2] = gray + factor * (data[i + 2] - gray);
  }
  
  return new ImageData(data, imageData.width, imageData.height);
};
