'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { transcriptAPI, analyticsAPI } from '@/lib/api';
import type { Transcript, TranscriptListResponse, TopicsResponse } from '@/types';
import { 
  formatDate, 
  formatDuration, 
  getSentimentBadge
} from '@/lib/utils';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  Filter,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Available topics for filter dropdown
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<string[]>([]);

  // Fetch transcripts
  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      if (startDate) filters.start_date = startDate;
      if (endDate) filters.end_date = endDate;
      if (participantEmail) filters.participant_email = participantEmail;
      if (topic) filters.topic = topic;

      const response: TranscriptListResponse = await transcriptAPI.getAll(filters);
      setTranscripts(response.transcripts);
      setCount(response.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transcripts');
      console.error('Error fetching transcripts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available topics for filter
  const fetchTopics = async () => {
    try {
      const response: TopicsResponse = await analyticsAPI.getTopics();
      setAvailableTopics(response.topics.map(t => t.topic_name));
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTranscripts();
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTranscripts();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, participantEmail, topic]);

  // Extract unique participant emails from transcripts
  useEffect(() => {
    const emails = new Set<string>();
    transcripts.forEach(t => {
      // Note: We'd need to fetch participants separately or include them in the list response
      // For now, we'll use the participant_email filter as a text input
    });
    setAvailableParticipants(Array.from(emails));
  }, [transcripts]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setParticipantEmail('');
    setTopic('');
  };

  const hasActiveFilters = startDate || endDate || participantEmail || topic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Meeting Transcripts
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all meeting transcripts
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {[startDate, endDate, participantEmail, topic].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Participant Email
                  </label>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Topics</option>
                    {availableTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{count} transcript{count !== 1 ? 's' : ''}</span>
            {hasActiveFilters && (
              <span className="text-blue-600 dark:text-blue-400">
                Filtered results
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading transcripts...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading transcripts</span>
            </div>
            <p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
            <button
              onClick={fetchTranscripts}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Transcripts Grid */}
        {!loading && !error && (
          <>
            {transcripts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No transcripts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'No transcripts have been added yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {transcripts.map((transcript) => (
                  <TranscriptCard key={transcript.id} transcript={transcript} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Transcript Card Component
function TranscriptCard({ transcript }: { transcript: Transcript }) {
  return (
    <Link href={`/transcripts/${transcript.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {transcript.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentBadge(
                transcript.sentiment
              )}`}
            >
              {transcript.sentiment || 'neutral'}
            </span>
            {transcript.platform && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                {transcript.platform}
              </span>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(transcript.occurred_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(transcript.duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{transcript.participant_count || 0} participant{transcript.participant_count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Tag className="w-4 h-4" />
            <span>{transcript.topic_count || 0} topic{transcript.topic_count !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Summary Preview */}
        {transcript.summary && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {transcript.summary}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

