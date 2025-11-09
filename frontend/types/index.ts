// Type definitions for API responses and data models

export interface Participant {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface Transcript {
  id: number;
  transcript_id: string;
  title: string;
  occurred_at: string;
  duration_minutes: number;
  sentiment: string;
  platform?: string;
  recording_url?: string;
  created_at: string;
  participant_count?: number;
  topic_count?: number;
  summary?: string;
  insights?: string[];
  transcript_text?: string;
  participants?: Participant[];
  topics?: string[];
  action_items?: ActionItem[];
  decisions?: string[];
}

export interface ActionItem {
  id: number;
  text: string;
  assignee?: string;
  due_date?: string;
  priority?: string;
}

export interface TranscriptListResponse {
  count: number;
  transcripts: Transcript[];
  filters?: {
    start_date?: string | null;
    end_date?: string | null;
    participant_email?: string | null;
    topic?: string | null;
  };
}

export interface IngestRequest {
  transcript_id: string;
  title: string;
  occurred_at: string;
  duration_minutes: number;
  participants: Participant[];
  transcript: string;
  metadata?: {
    platform?: string;
    recording_url?: string;
  };
}

export interface IngestResponse {
  id: number;
  status: string;
  summary: string;
  insights?: string[];
  extracted: {
    topics: string[];
    action_items: ActionItem[];
    decisions: string[];
    sentiment: string;
  };
}

export interface SearchResult {
  id: number;
  transcript_id: string;
  title: string;
  occurred_at: string;
  duration_minutes: number;
  sentiment: string;
  similarity_score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_searched: number;
}

export interface TopicStat {
  topic_name: string;
  topic_count: number;
}

export interface TopicsResponse {
  count: number;
  topics: TopicStat[];
}

export interface ParticipantAnalytics {
  id: number;
  name: string;
  email: string;
  meetings_attended: number;
  action_items_assigned: number;
  topics_discussed: number;
  decisions_involved_in: number;
}

export interface ParticipantAnalyticsResponse {
  total_participants: number;
  participants: ParticipantAnalytics[];
}

