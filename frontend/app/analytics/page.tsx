'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI, transcriptAPI } from '@/lib/api';
import type { TopicsResponse, ParticipantAnalyticsResponse, TranscriptListResponse } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  Users,
  Tag,
  TrendingUp,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
  Target,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [topicsData, setTopicsData] = useState<TopicsResponse | null>(null);
  const [participantsData, setParticipantsData] = useState<ParticipantAnalyticsResponse | null>(null);
  const [transcriptsCount, setTranscriptsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics data in parallel
        const [topics, participants, transcripts] = await Promise.all([
          analyticsAPI.getTopics(),
          analyticsAPI.getParticipants(),
          transcriptAPI.getAll(),
        ]);

        setTopicsData(topics);
        setParticipantsData(participants);
        setTranscriptsCount(transcripts.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading analytics</span>
            </div>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data - top 10 topics
  const chartData = topicsData?.topics
    .slice(0, 10)
    .map((topic) => ({
      name: topic.topic_name.length > 20 
        ? topic.topic_name.substring(0, 20) + '...' 
        : topic.topic_name,
      fullName: topic.topic_name,
      count: topic.topic_count,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Insights and statistics from all meeting transcripts
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
          <SummaryCard
            title="Total Transcripts"
            value={transcriptsCount}
            icon={FileText}
            color="blue"
          />
          <SummaryCard
            title="Total Topics"
            value={topicsData?.count || 0}
            icon={Tag}
            color="green"
          />
          <SummaryCard
            title="Total Participants"
            value={participantsData?.total_participants || 0}
            icon={Users}
            color="purple"
          />
          <SummaryCard
            title="Avg Topics/Meeting"
            value={
              transcriptsCount > 0 && topicsData
                ? Math.round((topicsData.count / transcriptsCount) * 10) / 10
                : 0
            }
            icon={TrendingUp}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-7xl mx-auto">
          {/* Topics Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Top Topics
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="currentColor" 
                    className="text-gray-300 dark:text-gray-600" 
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} meetings`,
                      props.payload.fullName,
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    name="Meetings"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No topic data available
              </div>
            )}
          </div>

          {/* Topics List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-green-600" />
              All Topics
            </h2>
            {topicsData && topicsData.topics.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {topicsData.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">
                      {topic.topic_name}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                      {topic.topic_count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No topics available
              </div>
            )}
          </div>
        </div>

        {/* Participant Analytics Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Participant Engagement
          </h2>
          {participantsData && participantsData.participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Participant
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Meetings
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Action Items
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Topics
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Decisions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participantsData.participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {participant.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {participant.email}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                          {participant.meetings_attended}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold">
                          {participant.action_items_assigned}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                          {participant.topics_discussed}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                          {participant.decisions_involved_in}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No participant data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

