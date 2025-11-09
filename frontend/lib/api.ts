// API client utilities for backend integration

import type {
  TranscriptListResponse,
  Transcript,
  IngestRequest,
  IngestResponse,
  SearchResponse,
  TopicsResponse,
  ParticipantAnalyticsResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Generic API fetch function with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Unknown error',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error or invalid response');
  }
}

/**
 * Transcript API functions
 */
export const transcriptAPI = {
  /**
   * Get all transcripts with optional filters
   */
  getAll: async (filters?: {
    start_date?: string;
    end_date?: string;
    participant_email?: string;
    topic?: string;
  }): Promise<TranscriptListResponse> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.participant_email) params.append('participant_email', filters.participant_email);
    if (filters?.topic) params.append('topic', filters.topic);

    const queryString = params.toString();
    return fetchAPI<TranscriptListResponse>(`/api/transcripts${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single transcript by ID
   */
  getById: async (id: number): Promise<Transcript> => {
    return fetchAPI<Transcript>(`/api/transcripts/${id}`);
  },

  /**
   * Ingest a new transcript
   */
  ingest: async (data: IngestRequest): Promise<IngestResponse> => {
    return fetchAPI<IngestResponse>('/api/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Search API functions
 */
export const searchAPI = {
  /**
   * Perform semantic search
   */
  semanticSearch: async (query: string): Promise<SearchResponse> => {
    return fetchAPI<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`);
  },
};

/**
 * Analytics API functions
 */
export const analyticsAPI = {
  /**
   * Get topic statistics
   */
  getTopics: async (): Promise<TopicsResponse> => {
    return fetchAPI<TopicsResponse>('/api/analytics/topics');
  },

  /**
   * Get participant analytics
   */
  getParticipants: async (): Promise<ParticipantAnalyticsResponse> => {
    return fetchAPI<ParticipantAnalyticsResponse>('/api/analytics/participants');
  },
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  return fetchAPI<{ status: string; timestamp: string }>('/health');
};

