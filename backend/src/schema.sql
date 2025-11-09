CREATE TABLE IF NOT EXISTS transcripts (
    id SERIAL PRIMARY KEY,
    transcript_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    transcript_text TEXT NOT NULL,
    platform VARCHAR(100),
    recording_url TEXT,
    sentiment VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transcript participants junction table (many-to-many)
CREATE TABLE IF NOT EXISTS transcript_participants (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    role VARCHAR(50),
    UNIQUE(transcript_id, participant_id)
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    topic_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Action items table
CREATE TABLE IF NOT EXISTS action_items (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    assignee VARCHAR(255),
    due_date DATE,
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    decision_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Embeddings table (for semantic search)
CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    embedding_vector TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transcripts_occurred_at ON transcripts(occurred_at);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_topics_transcript_id ON topics(transcript_id);
CREATE INDEX IF NOT EXISTS idx_action_items_transcript_id ON action_items(transcript_id);

-- Add summary column to transcripts table
ALTER TABLE transcripts ADD COLUMN IF NOT EXISTS summary TEXT;
-- Add insights column to transcripts table
ALTER TABLE transcripts ADD COLUMN IF NOT EXISTS insights TEXT;