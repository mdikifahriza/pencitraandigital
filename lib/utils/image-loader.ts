export const loadImageFromFile = (file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          dataUrl: e.target?.result as string,
          width: img.width,
          height: img.height,
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Ukuran file terlalu besar. Maksimal 10MB.',
    };
  }

  return { valid: true };
};
