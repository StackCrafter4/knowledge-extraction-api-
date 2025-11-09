import { Request, Response } from 'express';
import pool from '../db';
import { IngestRequestSchema } from '../schemas';
import { extractEntities, generateEmbedding,generateSummary,generateInsights} from '../openai.service';

export async function ingestTranscript(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = IngestRequestSchema.parse(req.body);

    // Check if transcript already exists
    const existingCheck = await pool.query(
      'SELECT id FROM transcripts WHERE transcript_id = $1',
      [validatedData.transcript_id]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Transcript with this ID already exists' 
      });
    }

    // Extract entities using OpenAI
    console.log('🤖 Extracting entities from transcript...');
    const extracted = await extractEntities(validatedData.transcript);

    // Generate insights
    console.log('💡 Generating insights...');
    const insights = await generateInsights(validatedData.transcript, extracted.topics, extracted.decisions);

    // Generate summary
    console.log('📝 Generating summary...');
    const summary = await generateSummary(validatedData.transcript);

    // Generate embedding for semantic search
    console.log('🔢 Generating embedding...');
    const embedding = await generateEmbedding(validatedData.transcript);

    // Start database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert transcript
      const transcriptResult = await client.query(
        `INSERT INTO transcripts 
        (transcript_id, title, occurred_at, duration_minutes, transcript_text, platform, recording_url, sentiment,summary,insights) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) 
        RETURNING id`,
        [
          validatedData.transcript_id,
          validatedData.title,
          validatedData.occurred_at,
          validatedData.duration_minutes,
          validatedData.transcript,
          validatedData.metadata?.platform,
          validatedData.metadata?.recording_url,
          extracted.sentiment,
          summary,
          insights
        ]
      );

      const transcriptId = transcriptResult.rows[0].id;

      // Insert participants
      for (const participant of validatedData.participants) {
        // Check if participant exists
        let participantResult = await client.query(
          'SELECT id FROM participants WHERE email = $1',
          [participant.email]
        );

        let participantId;
        if (participantResult.rows.length === 0) {
          // Create new participant
          participantResult = await client.query(
            'INSERT INTO participants (name, email) VALUES ($1, $2) RETURNING id',
            [participant.name, participant.email]
          );
          participantId = participantResult.rows[0].id;
        } else {
          participantId = participantResult.rows[0].id;
        }

        // Link participant to transcript
        await client.query(
          'INSERT INTO transcript_participants (transcript_id, participant_id, role) VALUES ($1, $2, $3)',
          [transcriptId, participantId, participant.role]
        );
      }

      // Insert topics
      for (const topic of extracted.topics) {
        await client.query(
          'INSERT INTO topics (transcript_id, topic_name) VALUES ($1, $2)',
          [transcriptId, topic]
        );
      }

      // Insert action items
      for (const item of extracted.action_items) {
        await client.query(
          'INSERT INTO action_items (transcript_id, text, assignee, due_date, priority) VALUES ($1, $2, $3, $4, $5)',
          [transcriptId, item.text, item.assignee, item.due_date, item.priority]
        );
      }

      // Insert decisions
      for (const decision of extracted.decisions) {
        await client.query(
          'INSERT INTO decisions (transcript_id, decision_text) VALUES ($1, $2)',
          [transcriptId, decision]
        );
      }

      // Insert embedding
      await client.query(
        'INSERT INTO embeddings (transcript_id, embedding_vector) VALUES ($1, $2)',
        [transcriptId, JSON.stringify(embedding)]
      );

      await client.query('COMMIT');

      // Return success response
      res.status(201).json({
        id: transcriptId,
        status: 'processed',
        summary: summary,
        insights: JSON.parse(insights),
        extracted: {
          topics: extracted.topics,
          action_items: extracted.action_items,
          decisions: extracted.decisions,
          sentiment: extracted.sentiment,
        },
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Error ingesting transcript:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process transcript',
      message: error.message 
    });
  }
}