import Link from 'next/link';
import { FileText, BarChart3, Search, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Knowledge Extraction API
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Intelligent meeting transcript analysis with AI-powered entity extraction, 
            semantic search, and analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link 
            href="/transcripts"
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transcripts
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all meeting transcripts with filters and search
            </p>
          </Link>

          <Link 
            href="/analytics"
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Analytics
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Explore topics, participant engagement, and meeting insights
            </p>
          </Link>

          <Link 
            href="/search"
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Semantic Search
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered semantic search across all transcripts
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
            <span className="text-sm font-medium">✨ All features are now available!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
