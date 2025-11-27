// src/components/workspace/HistogramViewer.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import { useHistogram } from '@/hooks/useHistogram';
import { useImageStore } from '@/store/imageStore';
import { BarChart3, Loader2, X } from 'lucide-react';

type Channel = 'red' | 'green' | 'blue' | 'gray';

interface HistogramViewerProps {
  onClose?: () => void;
}

export const HistogramViewer: React.FC<HistogramViewerProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { histogramData, isCalculating } = useHistogram();
  const { imageData } = useImageStore();
  const [activeChannel, setActiveChannel] = React.useState<Channel>('gray');

  useEffect(() => {
    if (!histogramData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = histogramData[activeChannel];
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);

    // Find max value for normalization
    const maxValue = Math.max(...data);
    if (maxValue === 0) return;

    // Draw grid lines first (behind histogram)
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw histogram bars with gradient
    const barWidth = width / 256;
    
    const gradientColors = {
      red: { start: 'rgba(239, 68, 68, 0.8)', end: 'rgba(239, 68, 68, 0.2)' },
      green: { start: 'rgba(34, 197, 94, 0.8)', end: 'rgba(34, 197, 94, 0.2)' },
      blue: { start: 'rgba(59, 130, 246, 0.8)', end: 'rgba(59, 130, 246, 0.2)' },
      gray: { start: 'rgba(156, 163, 175, 0.8)', end: 'rgba(156, 163, 175, 0.2)' },
    };
    
    for (let i = 0; i < 256; i++) {
      const barHeight = (data[i] / maxValue) * height;
      const x = i * barWidth;
      const y = height - barHeight;
      
      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(x, y, x, height);
      gradient.addColorStop(0, gradientColors[activeChannel].start);
      gradient.addColorStop(1, gradientColors[activeChannel].end);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(barWidth, 1), barHeight);
    }
  }, [histogramData, activeChannel]);

  if (!imageData.current) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-lg rounded-lg p-4 h-48 flex items-center justify-center border border-gray-700/30 shadow-2xl">
        <div className="text-center text-gray-500">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No histogram data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-lg rounded-lg p-4 space-y-3 max-w-lg w-full mx-4 relative border border-gray-700/30 shadow-2xl">
      {/* Tombol close */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Histogram</h3>
        {isCalculating && (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        )}
      </div>

      {/* Channel Selector */}
      <div className="flex gap-1">
        {(['gray', 'red', 'green', 'blue'] as Channel[]).map((channel) => (
          <button
            key={channel}
            onClick={() => setActiveChannel(channel)}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              activeChannel === channel
                ? channel === 'red'
                  ? 'bg-red-600 text-white'
                  : channel === 'green'
                  ? 'bg-green-600 text-white'
                  : channel === 'blue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {channel.charAt(0).toUpperCase() + channel.slice(1)}
          </button>
        ))}
      </div>

      {/* Histogram Canvas */}
      <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/20 rounded overflow-hidden backdrop-blur-sm border border-gray-700/30">
        <canvas
          ref={canvasRef}
          width={512}
          height={150}
          className="w-full"
        />
      </div>

      <div className="text-xs text-gray-500 flex justify-between">
        <span>0</span>
        <span>128</span>
        <span>255</span>
      </div>
    </div>
  );
};