import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

require('dotenv').config({path: path.resolve(__dirname, '../../.env') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Extract entities from transcript using GPT
export async function extractEntities(transcript: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that extracts structured information from meeting transcripts. 
Extract: topics, action items, decisions, and sentiment.
Return ONLY valid JSON with this structure:
{
  "topics": ["topic1", "topic2"],
  "action_items": [{"text": "task description", "assignee": "name or null", "due_date": "YYYY-MM-DD or null", "priority": "high/medium/low"}],
  "decisions": ["decision1", "decision2"],
  "sentiment": "positive/neutral/negative"
}`
        },
        {
          role: 'user',
          content: `Extract information from this transcript:\n\n${transcript}`
        }
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error extracting entities:', error);
    throw error;
  }
}

// Generate embeddings for semantic search
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}