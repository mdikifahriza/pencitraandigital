'use client';

import React, { useRef } from 'react';
import { Upload, Download, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useImageStore } from '@/store/imageStore';

export const FileSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageData, handleUpload, handleDownload, handleReset, handleClear } = useImageProcessor();
  const { mode, addBatchImages, batchImages } = useImageStore();
  const [error, setError] = React.useState<string>('');

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    
    try {
      if (mode === 'batch') {
        // Batch mode: upload multiple files
        await addBatchImages(Array.from(files));
      } else {
        // Single mode: upload one file
        const file = files[0];
        await handleUpload(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onDownloadClick = async () => {
    try {
      await handleDownload('png');
    } catch (err) {
      setError('Failed to download image');
    }
  };

  const hasContent = mode === 'batch' ? batchImages.length > 0 : !!imageData.current;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
        File
      </h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={mode === 'batch'}
        onChange={onFileChange}
        className="hidden"
      />

      <div className="space-y-2">
        <Button
          onClick={onUploadClick}
          variant="primary"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <Upload size={16} />
          {mode === 'batch' ? 'Upload Images (Multiple)' : 'Upload Image'}
        </Button>

        {mode === 'single' && (
          <>
            <Button
              onClick={onDownloadClick}
              variant="secondary"
              size="sm"
              disabled={!imageData.current}
              className="w-full flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Save Image
            </Button>

            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              disabled={!imageData.original}
              className="w-full flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          </>
        )}

        <Button
          onClick={handleClear}
          variant="danger"
          size="sm"
          disabled={!hasContent}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          {mode === 'batch' ? 'Clear All' : 'Clear'}
        </Button>
      </div>

      {mode === 'batch' && batchImages.length > 0 && (
        <div className="text-xs text-blue-400 bg-blue-900/20 p-2 rounded">
          {batchImages.length} image{batchImages.length !== 1 ? 's' : ''} loaded. Operations will apply to all images.
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};