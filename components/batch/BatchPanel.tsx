'use client';

import React, { useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { exportBatchAsZip } from '@/lib/batch/batch-processor';
import { 
  Upload, 
  X, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Package
} from 'lucide-react';

export const BatchPanel: React.FC = () => {
  const { batchImages, addBatchImages, removeBatchImage, clearBatch } = useImageStore();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    await addBatchImages(files);
    e.target.value = ''; // Reset input
  }, [addBatchImages]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      await addBatchImages(files);
    }
  }, [addBatchImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDownloadAllAsZip = async () => {
    try {
      await exportBatchAsZip(batchImages, 'batch-processed-images.zip');
    } catch (error) {
      console.error('Failed to export batch as ZIP:', error);
      alert('Failed to export images. Please try again.');
    }
  };

  const completedCount = batchImages.filter(img => img.status === 'completed').length;
  const processingCount = batchImages.filter(img => img.status === 'processing').length;
  const errorCount = batchImages.filter(img => img.status === 'error').length;
  const pendingCount = batchImages.filter(img => img.status === 'pending').length;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div>
          <h2 className="text-lg font-semibold text-white">Batch Processing</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-400">
              {batchImages.length} total
            </p>
            {completedCount > 0 && (
              <span className="text-sm text-green-400">• {completedCount} completed</span>
            )}
            {processingCount > 0 && (
              <span className="text-sm text-blue-400">• {processingCount} processing</span>
            )}
            {pendingCount > 0 && (
              <span className="text-sm text-gray-500">• {pendingCount} pending</span>
            )}
            {errorCount > 0 && (
              <span className="text-sm text-red-400">• {errorCount} failed</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {batchImages.length > 0 && (
            <>
              <button
                onClick={handleDownloadAllAsZip}
                disabled={completedCount === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Package size={16} />
                <span className="hidden sm:inline">Download ZIP</span>
              </button>
              <button
                onClick={clearBatch}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {batchImages.length === 0 ? (
          // Upload Area
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="h-full flex items-center justify-center p-8"
          >
            <label className="cursor-pointer w-full max-w-2xl">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-gray-800/50 transition-all">
                <Upload size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Upload Multiple Images
                </h3>
                <p className="text-gray-400 mb-6">
                  Drag & drop images here or click to browse
                </p>
                <div className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-block transition-colors font-medium">
                  Select Files
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Supported: JPG, PNG, WebP, GIF (max 10MB each)
                </p>
              </div>
            </label>
          </div>
        ) : (
          // Images Grid
          <div className="p-4">
            {/* Add More Button */}
            <div className="mb-4">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-gray-800/50 transition-all">
                  <Upload size={24} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400">Click to add more images</p>
                </div>
              </label>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {batchImages.map((img) => (
                <div
                  key={img.id}
                  className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group hover:border-gray-600 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="aspect-square bg-checkerboard relative">
                    <img
                      src={img.current}
                      alt={img.file.name}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Status Overlay */}
                    {img.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                        <span className="text-white text-sm font-medium">{img.progress}%</span>
                      </div>
                    )}
                    
                    {img.status === 'completed' && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                    
                    {img.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="text-red-500" size={32} />
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeBatchImage(img.id)}
                      className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-2 bg-gray-850">
                    <p className="text-xs text-gray-300 truncate font-medium" title={img.file.name}>
                      {img.file.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {img.width} × {img.height}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(img.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    {img.status === 'processing' && (
                      <div className="mt-2 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {img.status === 'error' && img.error && (
                      <p className="text-xs text-red-400 mt-1 line-clamp-2" title={img.error}>
                        {img.error}
                      </p>
                    )}

                    {/* Status Badge */}
                    <div className="mt-2">
                      {img.status === 'pending' && (
                        <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full">
                          Pending
                        </span>
                      )}
                      {img.status === 'completed' && (
                        <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full">
                          Completed
                        </span>
                      )}
                      {img.status === 'error' && (
                        <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};