import { Request, Response } from 'express';
import pool from '../db';

// GET /api/transcripts - List all transcripts
export async function getTranscripts(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.transcript_id,
        t.title,
        t.occurred_at,
        t.duration_minutes,
        t.sentiment,
        t.platform,
        t.created_at,
        COUNT(DISTINCT tp.participant_id) as participant_count,
        COUNT(DISTINCT top.id) as topic_count
      FROM transcripts t
      LEFT JOIN transcript_participants tp ON t.id = tp.transcript_id
      LEFT JOIN topics top ON t.id = top.transcript_id
      GROUP BY t.id
      ORDER BY t.occurred_at DESC
    `);

    res.json({
      count: result.rows.length,
      transcripts: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching transcripts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transcripts',
      message: error.message 
    });
  }
}

// GET /api/transcripts/:id - Get single transcript with all details
export async function getTranscriptById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Get transcript
    const transcriptResult = await pool.query(
      'SELECT * FROM transcripts WHERE id = $1',
      [id]
    );

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const transcript = transcriptResult.rows[0];

    // Get participants
    const participantsResult = await pool.query(`
      SELECT p.id, p.name, p.email, tp.role
      FROM participants p
      JOIN transcript_participants tp ON p.id = tp.participant_id
      WHERE tp.transcript_id = $1
    `, [id]);

    // Get topics
    const topicsResult = await pool.query(
      'SELECT id, topic_name FROM topics WHERE transcript_id = $1',
      [id]
    );

    // Get action items
    const actionItemsResult = await pool.query(
      'SELECT id, text, assignee, due_date, priority FROM action_items WHERE transcript_id = $1',
      [id]
    );

    // Get decisions
    const decisionsResult = await pool.query(
      'SELECT id, decision_text FROM decisions WHERE transcript_id = $1',
      [id]
    );

    // Combine all data
    res.json({
      ...transcript,
      participants: participantsResult.rows,
      topics: topicsResult.rows.map(t => t.topic_name),
      action_items: actionItemsResult.rows,
      decisions: decisionsResult.rows.map(d => d.decision_text)
    });

  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transcript',
      message: error.message 
    });
  }
}
