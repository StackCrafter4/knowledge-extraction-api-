import { Request, Response } from 'express';
import pool from '../db';


export async function getTopics(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        t.topic_name,
        COUNT(t.topic_name) AS topic_count
      FROM 
        topics t
      GROUP BY 
        t.topic_name
      ORDER BY 
        topic_count DESC
    `);
    res.json({
      count: result.rows.length, 
      topics: result.rows 
    });
  } catch (error: any) {
    console.error('Error fetching transcripts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transcripts',
      message: error.message 
    });
  }
}
