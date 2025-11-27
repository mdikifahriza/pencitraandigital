// src/lib/image-processing/histogram.ts

export interface HistogramData {
  red: number[];
  green: number[];
  blue: number[];
  gray: number[];
}

export const calculateHistogram = (imageData: ImageData): HistogramData => {
  const red = new Array(256).fill(0);
  const green = new Array(256).fill(0);
  const blue = new Array(256).fill(0);
  const gray = new Array(256).fill(0);

  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    red[data[i]]++;
    green[data[i + 1]]++;
    blue[data[i + 2]]++;

    // Calculate grayscale value
    const grayValue = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    gray[grayValue]++;
  }

  return { red, green, blue, gray };
};

export const histogramEqualization = (imageData: ImageData): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const totalPixels = width * height;

  // Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    histogram[gray]++;
  }

  // Calculate cumulative distribution function (CDF)
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  // Normalize CDF
  const cdfMin = cdf.find(val => val > 0) || 0;
  const lookupTable = cdf.map(val => 
    Math.round(((val - cdfMin) / (totalPixels - cdfMin)) * 255)
  );

  // Apply equalization
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    const newGray = lookupTable[gray];

    output[i] = newGray;
    output[i + 1] = newGray;
    output[i + 2] = newGray;
  }

  return new ImageData(output, width, height);
};

export const histogramStretch = (imageData: ImageData): ImageData => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);

  // Find min and max values
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    min = Math.min(min, gray);
    max = Math.max(max, gray);
  }

  // Stretch histogram
  const range = max - min;
  if (range === 0) return imageData;

  for (let i = 0; i < data.length; i += 4) {
    output[i] = Math.round(((data[i] - min) / range) * 255);
    output[i + 1] = Math.round(((data[i + 1] - min) / range) * 255);
    output[i + 2] = Math.round(((data[i + 2] - min) / range) * 255);
  }

  return new ImageData(output, width, height);
};