import express, { Request, Response } from 'express';
import { ingestTranscript } from './routes/ingest';
import { getTranscripts,getTranscriptById } from './routes/transcripts';
import { semanticSearch } from './routes/search';
import { getTopics } from './routes/topics';
import { getParticipantAnalytics } from './routes/participants';
import cors from 'cors';
import dotenv from 'dotenv';
import { get } from 'http';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Knowledge Extraction API',
    status: 'running'
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.post('/api/ingest', ingestTranscript);
app.get('/api/transcripts',getTranscripts);
app.get('/api/transcripts/:id', getTranscriptById);
app.get('/api/search', semanticSearch)
app.get('/api/analytics/topics',getTopics);
app.get('/api/analytics/participants',getParticipantAnalytics)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
