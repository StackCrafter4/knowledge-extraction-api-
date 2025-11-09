import { Request, Response } from 'express';
import pool from '../db';
export async function getParticipantAnalytics(req: Request, res: Response) {
  try {
    const query = `
      SELECT
        p.id,
        p.name,
        p.email,
        
        -- Count of meetings they are part of
        (
          SELECT COUNT(tp.transcript_id) 
          FROM transcript_participants tp 
          WHERE tp.participant_id = p.id
        ) AS meetings_attended,
        
        -- Count of action items assigned to their name.
        -- This assumes 'action_items.assignee' is a string that matches 'participants.name'.
        (
          SELECT COUNT(ai.id) 
          FROM action_items ai 
          WHERE ai.assignee = p.name
        ) AS action_items_assigned,
        
        -- Count of topics from all meetings they attended
        (
          SELECT COUNT(t.id) 
          FROM topics t
          WHERE t.transcript_id IN (
            SELECT tp.transcript_id 
            FROM transcript_participants tp 
            WHERE tp.participant_id = p.id
          )
        ) AS topics_discussed,

        -- Count of decisions from all meetings they attended
        (
          SELECT COUNT(d.id) 
          FROM decisions d
          WHERE d.transcript_id IN (
            SELECT tp.transcript_id 
            FROM transcript_participants tp 
            WHERE tp.participant_id = p.id
          )
        ) AS decisions_involved_in
        
      FROM 
        participants p
      ORDER BY
        meetings_attended DESC,
        action_items_assigned DESC,
        p.name;
    `;

    const result = await pool.query(query);

    res.json({
      total_participants: result.rows.length,
      participants: result.rows
    });

  } catch (error: any) {
    console.error('Error fetching participant analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch participant analytics',
      message: error.message 
    });
  }
}