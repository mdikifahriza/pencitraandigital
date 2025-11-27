'use client';

import React from 'react';
import { Image, Menu } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-gray-400" />
        </button>

        <Image size={28} className="text-blue-500 flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg lg:text-xl font-bold text-white truncate">
            Simple Image Processing Studio
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            powered by JavaScript + Canvas
          </p>
        </div>
      </div>
    </header>
  );
};
