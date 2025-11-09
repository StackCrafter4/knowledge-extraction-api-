'use client';

import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Knowledge Extraction API
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Knowledge Extraction API. Built with Next.js & TypeScript.
          </div>
        </div>
      </div>
    </footer>
  );
}

