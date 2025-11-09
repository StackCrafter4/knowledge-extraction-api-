'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { transcriptAPI } from '@/lib/api';
import type { Transcript } from '@/types';
import {
  formatDate,
  formatDateTime,
  formatDuration,
  getSentimentBadge,
  getPriorityColor,
  highlightEntities,
} from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Tag,
  CheckCircle,
  FileText,
  Lightbulb,
  AlertCircle,
  Loader2,
  Mail,
  TrendingUp,
  Target,
} from 'lucide-react';

export default function TranscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await transcriptAPI.getById(id);
        setTranscript(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transcript');
        console.error('Error fetching transcript:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTranscript();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading transcript...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transcript) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading transcript</span>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error || 'Transcript not found'}</p>
            <Link
              href="/transcripts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transcripts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Combine all entities for highlighting
  const entities = [
    ...(transcript.topics || []),
    ...(transcript.participants?.map(p => p.name) || []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex justify-center mb-6">
          <Link
            href="/transcripts"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Transcripts
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6 max-w-5xl mx-auto">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {transcript.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getSentimentBadge(
                  transcript.sentiment
                )}`}
              >
                {transcript.sentiment || 'neutral'}
              </span>
              {transcript.platform && (
                <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                  {transcript.platform}
                </span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(transcript.occurred_at)}
                </div>
                <div className="text-xs">{formatDateTime(transcript.occurred_at)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDuration(transcript.duration_minutes)}
                </div>
                <div className="text-xs">Duration</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {transcript.participants?.length || 0}
                </div>
                <div className="text-xs">Participants</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Tag className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {transcript.topics?.length || 0}
                </div>
                <div className="text-xs">Topics</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            {transcript.summary && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {transcript.summary}
                </p>
              </div>
            )}

            {/* Insights */}
            {transcript.insights && transcript.insights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Key Insights
                </h2>
                <ul className="space-y-2">
                  {transcript.insights.map((insight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics */}
            {transcript.topics && transcript.topics.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Topics Discussed
                </h2>
                <div className="flex flex-wrap gap-2">
                  {transcript.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {transcript.action_items && transcript.action_items.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Action Items
                </h2>
                <div className="space-y-3">
                  {transcript.action_items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-gray-900 dark:text-white mb-2">{item.text}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {item.assignee && (
                          <span className="text-gray-600 dark:text-gray-400">
                            Assigned to: <span className="font-medium">{item.assignee}</span>
                          </span>
                        )}
                        {item.due_date && (
                          <span className="text-gray-600 dark:text-gray-400">
                            Due: <span className="font-medium">{item.due_date}</span>
                          </span>
                        )}
                        {item.priority && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decisions */}
            {transcript.decisions && transcript.decisions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Decisions Made
                </h2>
                <ul className="space-y-2">
                  {transcript.decisions.map((decision, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Transcript */}
            {transcript.transcript_text && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Full Transcript
                </h2>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightEntities(transcript.transcript_text, entities),
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            {/* Participants */}
            {transcript.participants && transcript.participants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participants
                </h2>
                <div className="space-y-3">
                  {transcript.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {participant.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Mail className="w-4 h-4" />
                        {participant.email}
                      </div>
                      {participant.role && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {participant.role}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recording URL */}
            {transcript.recording_url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Recording
                </h2>
                <a
                  href={transcript.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {transcript.recording_url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

