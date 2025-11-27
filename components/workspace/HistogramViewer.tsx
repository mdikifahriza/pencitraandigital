// src/components/workspace/HistogramViewer.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import { useHistogram } from '@/hooks/useHistogram';
import { useImageStore } from '@/store/imageStore';
import { BarChart3, Loader2 } from 'lucide-react';

type Channel = 'red' | 'green' | 'blue' | 'gray';

export const HistogramViewer: React.FC = () => {
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
    
    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Find max value for normalization
    const maxValue = Math.max(...data);
    if (maxValue === 0) return;

    // Draw histogram bars
    const barWidth = width / 256;
    
    const colors = {
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
      gray: '#9ca3af',
    };

    ctx.fillStyle = colors[activeChannel];
    
    for (let i = 0; i < 256; i++) {
      const barHeight = (data[i] / maxValue) * height;
      const x = i * barWidth;
      const y = height - barHeight;
      
      ctx.fillRect(x, y, Math.max(barWidth, 1), barHeight);
    }

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [histogramData, activeChannel]);

  if (!imageData.current) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No histogram data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
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
      <div className="bg-gray-900 rounded overflow-hidden">
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