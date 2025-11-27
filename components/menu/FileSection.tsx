'use client';

import React, { useRef } from 'react';
import { Upload, Download, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useImageProcessor } from '@/hooks/useImageProcessor';

export const FileSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageData, handleUpload, handleDownload, handleReset, handleClear } = useImageProcessor();
  const [error, setError] = React.useState<string>('');

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      await handleUpload(file);
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

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
        File
      </h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
          Upload Image
        </Button>

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

        <Button
          onClick={handleClear}
          variant="danger"
          size="sm"
          disabled={!imageData.current}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Clear
        </Button>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};