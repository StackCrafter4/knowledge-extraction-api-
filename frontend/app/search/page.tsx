'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchAPI } from '@/lib/api';
import type { SearchResponse, SearchResult } from '@/types';
import { formatDate, formatDuration, getSentimentBadge } from '@/lib/utils';
import {
  Search,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStats, setSearchStats] = useState<{ query: string; total_searched: number } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response: SearchResponse = await searchAPI.semanticSearch(query.trim());
      setResults(response.results);
      setSearchStats({
        query: response.query,
        total_searched: response.total_searched,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error performing search:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
    setSearchStats(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Semantic Search
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered semantic search across all meeting transcripts. Find relevant meetings by meaning, not just keywords.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for meetings by topic, decision, or context..."
                className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Search Tips */}
          {!hasSearched && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Semantic search understands context and meaning. Try queries like "budget discussions", "product launch decisions", or "team collaboration meetings".
              </p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Search Error</span>
              </div>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Search Stats */}
        {searchStats && !loading && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Found <strong className="text-gray-900 dark:text-white">{results.length}</strong> relevant result{results.length !== 1 ? 's' : ''} 
                {searchStats.total_searched > 0 && (
                  <> out of {searchStats.total_searched} transcript{searchStats.total_searched !== 1 ? 's' : ''}</>
                )}
              </span>
              {query && (
                <span>
                  Query: <strong className="text-gray-900 dark:text-white">&quot;{searchStats.query}&quot;</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Searching transcripts...
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div className="max-w-4xl mx-auto">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try different keywords or a more general search term.
                </p>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State - Before Search */}
        {!hasSearched && !loading && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a search query above to find relevant meeting transcripts using AI-powered semantic search.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Search Result Card Component
function SearchResultCard({ result }: { result: SearchResult }) {
  const similarityPercentage = Math.round(result.similarity_score * 100);

  return (
    <Link href={`/transcripts/${result.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {result.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentBadge(
                  result.sentiment
                )}`}
              >
                {result.sentiment || 'neutral'}
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                {result.transcript_id}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
                {similarityPercentage}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Relevance</div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(result.occurred_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(result.duration_minutes)}</span>
          </div>
        </div>

        {/* Similarity Score Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Relevance Score</span>
            <span>{similarityPercentage}% match</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${similarityPercentage}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            View Transcript →
          </span>
        </div>
      </div>
    </Link>
  );
}

