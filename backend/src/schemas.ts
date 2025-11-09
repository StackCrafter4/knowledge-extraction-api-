import { z } from 'zod';

// Participant schema
export const ParticipantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  role: z.string().optional(),
});

// Metadata schema
export const MetadataSchema = z.object({
  platform: z.string().optional(),
  recording_url: z.string().url().optional(),
});

// Ingest request schema
export const IngestRequestSchema = z.object({
  transcript_id: z.string().min(1, 'Transcript ID is required'),
  title: z.string().min(1, 'Title is required'),
  occurred_at: z.string().datetime('Invalid datetime format'),
  duration_minutes: z.number().positive('Duration must be positive'),
  participants: z.array(ParticipantSchema).min(1, 'At least one participant required'),
  transcript: z.string().min(10, 'Transcript too short'),
  metadata: MetadataSchema.optional(),
});

// TypeScript types inferred from schemas
export type ParticipantInput = z.infer<typeof ParticipantSchema>;
export type MetadataInput = z.infer<typeof MetadataSchema>;
export type IngestRequest = z.infer<typeof IngestRequestSchema>;