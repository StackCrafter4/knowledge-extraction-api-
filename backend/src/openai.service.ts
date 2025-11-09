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

// Generate summary for transcript
export async function generateSummary(transcript: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert summary creator assistant that creates concise summaries of meeting transcripts. 
Generate a 2-3 sentence summary that captures the main purpose, key topics discussed, and outcomes of the meeting.
Be specific and actionable. Return ONLY the summary text, no additional formatting.`
        },
        {
          role: 'user',
          content: `Summarize this meeting transcript in 2-3 sentences:\n\n${transcript}`
        }
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No summary generated from OpenAI');
    
    return content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

// Generate key insights from transcript
export async function generateInsights(transcript: string, topics: string[], decisions: string[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert assistant that generates key insights from meeting transcripts.
Analyze the transcript, topics discussed, and decisions made to identify 3-5 key insights.
Insights should highlight important patterns, implications, strategic points, or actionable observations.
Format as a JSON array of insight strings. Return ONLY valid JSON array like: ["insight1", "insight2", "insight3"]`
        },
        {
          role: 'user',
          content: `Generate key insights from this meeting transcript:

Transcript: ${transcript}

Topics discussed: ${topics.join(', ')}

Decisions made: ${decisions.join(', ')}

Return 3-5 key insights as a JSON array.`
        }
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No insights generated from OpenAI');
    
    // Parse and validate JSON array
    const insights = JSON.parse(content);
    if (!Array.isArray(insights)) {
      throw new Error('Insights must be an array');
    }
    
    return JSON.stringify(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}