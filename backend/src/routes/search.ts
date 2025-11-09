import { Request, Response } from 'express';
import pool from '../db';
import { generateEmbedding } from '../openai.service';

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// GET /api/search?q=query
export async function semanticSearch(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required' 
      });
    }

    // Generate embedding for search query
    console.log('🔍 Searching for:', q);
    const queryEmbedding = await generateEmbedding(q);

    // Get all transcript embeddings
    const embeddingsResult = await pool.query(`
      SELECT 
        e.transcript_id,
        e.embedding_vector,
        t.id,
        t.transcript_id as tid,
        t.title,
        t.occurred_at,
        t.duration_minutes,
        t.sentiment
      FROM embeddings e
      JOIN transcripts t ON e.transcript_id = t.id
    `);

    // Calculate similarity scores
    const results = embeddingsResult.rows.map(row => {
      const storedEmbedding = JSON.parse(row.embedding_vector);
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
      
      return {
        id: row.id,
        transcript_id: row.tid,
        title: row.title,
        occurred_at: row.occurred_at,
        duration_minutes: row.duration_minutes,
        sentiment: row.sentiment,
        similarity_score: similarity
      };
    });

    // Sort by similarity (highest first) and return top 5
    const topResults = results
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 5);

    res.json({
      query: q,
      results: topResults,
      total_searched: results.length
    });

  } catch (error: any) {
    console.error('Error performing search:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
}
