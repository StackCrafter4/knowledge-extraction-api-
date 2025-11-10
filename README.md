# Knowledge Extraction API

A full-stack application for intelligent meeting transcript analysis with AI-powered entity extraction, semantic search, and analytics. Built with Express.js (TypeScript), Next.js, PostgreSQL, and OpenAI.

## 🚀 Quick Start

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd knowledge-extraction-api-
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Set up environment variables
# Create .env in root directory (see Configuration section)
# Create frontend/.env.local (see Configuration section)

# 3. Start database
docker-compose up -d

# 4. Initialize database schema
docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U dev -d knowledge_db < backend/src/schema.sql

# 5. Start backend (Terminal 1)
cd backend && npm run dev

# 6. Start frontend (Terminal 2)
cd frontend && npm run dev

# 7. Open http://localhost:3001 in your browser
```

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Backend
- **Transcript Ingestion**: Process meeting transcripts with AI-powered entity extraction
- **Entity Extraction**: Automatically extract topics, action items, decisions, and sentiment
- **AI Summarization**: Generate concise 2-3 sentence summaries
- **Key Insights**: Generate actionable insights from transcripts
- **Semantic Search**: AI-powered search using OpenAI embeddings
- **Analytics**: Topic statistics and participant engagement metrics
- **Filtering**: Filter transcripts by date, participants, and topics

### Frontend
- **Transcript List**: View all transcripts with advanced filtering
- **Transcript Detail**: View full transcript with highlighted entities
- **Analytics Dashboard**: Interactive charts and participant analytics
- **Semantic Search**: AI-powered search interface with relevance scoring
- **Responsive Design**: Mobile-friendly with dark mode support
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **AI**: OpenAI API (GPT-4o-mini, text-embedding-3-small)
- **Validation**: Zod
- **ORM**: Native PostgreSQL (pg)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (via Docker)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm** (v9 or higher) or **yarn**
   ```bash
   npm --version  # Should be v9+
   ```

3. **Docker** and **Docker Compose**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Git** (for cloning the repository)
   ```bash
   git --version
   ```

5. **OpenAI API Key** (Get one from [OpenAI Platform](https://platform.openai.com/api-keys))

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd knowledge-extraction-api-
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 4: Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the **root directory** of the project:

```bash
# Database Configuration
# For Docker: postgresql://dev:devpass@localhost:5432/knowledge_db
# For Local PostgreSQL: postgresql://username:password@localhost:5432/knowledge_db
DATABASE_URL=postgresql://dev:devpass@localhost:5432/knowledge_db

# OpenAI API Key (Required)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-api-key-here

# Backend Server Port (Optional, defaults to 3000)
PORT=3000
```

#### Frontend Environment Variables

Create a `.env.local` file in the **frontend directory**:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important Notes**: 
- Replace `sk-proj-your-api-key-here` with your actual OpenAI API key
- Never commit `.env` or `.env.local` files to version control (they're in `.gitignore`)
- The backend uses the root `.env` file
- The frontend uses `frontend/.env.local` for browser-accessible variables
- Next.js requires `NEXT_PUBLIC_` prefix for browser-accessible environment variables

## 🗄 Database Setup

### Option 1: Using Docker Compose (Recommended)

1. **Start PostgreSQL container**:
   ```bash
   docker-compose up -d
   ```

2. **Verify the container is running**:
   ```bash
   docker-compose ps
   ```

3. **Initialize the database schema**:
   
   **Option A: Using docker exec (Recommended)**:
   ```bash
   # Find the container name
   docker ps | grep postgres
   
   # Run the schema (replace CONTAINER_NAME with actual container name)
   docker exec -i CONTAINER_NAME psql -U dev -d knowledge_db < backend/src/schema.sql
   ```
   
   **Option B: Using automatic container name**:
   ```bash
   docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U dev -d knowledge_db < backend/src/schema.sql
   ```
   
   **Option C: Connect interactively**:
   ```bash
   docker exec -it CONTAINER_NAME psql -U dev -d knowledge_db
   ```
   Then copy and paste the contents of `backend/src/schema.sql` into the psql prompt, or run:
   ```sql
   \i /path/to/backend/src/schema.sql
   ```
   
   **Verify the schema was applied**:
   ```bash
   docker exec -it CONTAINER_NAME psql -U dev -d knowledge_db -c "\dt"
   ```
   You should see tables: transcripts, participants, topics, action_items, decisions, embeddings

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from [PostgreSQL website](https://www.postgresql.org/download/)

2. **Create database and user**:
   ```bash
   psql -U postgres
   ```
   ```sql
   CREATE DATABASE knowledge_db;
   CREATE USER dev WITH PASSWORD 'devpass';
   GRANT ALL PRIVILEGES ON DATABASE knowledge_db TO dev;
   \q
   ```

3. **Update DATABASE_URL in `.env`**:
   ```bash
   DATABASE_URL=postgresql://dev:devpass@localhost:5432/knowledge_db
   ```

4. **Run the schema**:
   ```bash
   psql -U dev -d knowledge_db -f backend/src/schema.sql
   ```

## ▶️ Running the Project

### Start the Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

You should see:
```
🚀 Server running on http://localhost:3000
✅ Connected to PostgreSQL database
```

### Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3001`

You should see:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3001
```

### Access the Application

1. **Frontend**: Open [http://localhost:3001](http://localhost:3001) in your browser
2. **Backend API**: [http://localhost:3000](http://localhost:3000)
3. **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Ingest Transcript
**POST** `/api/ingest`

Ingest a new meeting transcript for processing.

**Request Body**:
```json
{
  "transcript_id": "meeting-001",
  "title": "Q4 Planning Meeting",
  "occurred_at": "2025-10-15T14:00:00Z",
  "duration_minutes": 45,
  "participants": [
    {
      "name": "John Doe",
      "email": "john@acme.com",
      "role": "speaker"
    }
  ],
  "transcript": "Full meeting transcript text here...",
  "metadata": {
    "platform": "zoom",
    "recording_url": "https://..."
  }
}
```

**Response**:
```json
{
  "id": 1,
  "status": "processed",
  "summary": "2-3 sentence summary...",
  "insights": ["insight1", "insight2"],
  "extracted": {
    "topics": ["Budget Planning", "Q4 Goals"],
    "action_items": [{"text": "Review Q3 report", "assignee": "John", "due_date": "2025-10-20", "priority": "high"}],
    "decisions": ["Approved budget increase of 15%"],
    "sentiment": "positive"
  }
}
```

#### 2. Get All Transcripts
**GET** `/api/transcripts`

Get all transcripts with optional filters.

**Query Parameters**:
- `start_date` (optional): Filter by start date (ISO 8601)
- `end_date` (optional): Filter by end date (ISO 8601)
- `participant_email` (optional): Filter by participant email
- `topic` (optional): Filter by topic name

**Example**:
```
GET /api/transcripts?start_date=2025-10-01T00:00:00Z&topic=Budget%20Planning
```

**Response**:
```json
{
  "count": 10,
  "transcripts": [...],
  "filters": {
    "start_date": "2025-10-01T00:00:00Z",
    "topic": "Budget Planning"
  }
}
```

#### 3. Get Transcript by ID
**GET** `/api/transcripts/:id`

Get a single transcript with all details.

**Response**:
```json
{
  "id": 1,
  "transcript_id": "meeting-001",
  "title": "Q4 Planning Meeting",
  "occurred_at": "2025-10-15T14:00:00Z",
  "duration_minutes": 45,
  "sentiment": "positive",
  "summary": "...",
  "insights": [...],
  "participants": [...],
  "topics": [...],
  "action_items": [...],
  "decisions": [...],
  "transcript_text": "..."
}
```

#### 4. Semantic Search
**GET** `/api/search?q=query`

Perform semantic search across all transcripts.

**Query Parameters**:
- `q` (required): Search query

**Example**:
```
GET /api/search?q=budget%20discussions
```

**Response**:
```json
{
  "query": "budget discussions",
  "results": [
    {
      "id": 1,
      "title": "Q4 Planning Meeting",
      "similarity_score": 0.85,
      ...
    }
  ],
  "total_searched": 10
}
```

#### 5. Get Topic Analytics
**GET** `/api/analytics/topics`

Get topic statistics.

**Response**:
```json
{
  "count": 15,
  "topics": [
    {"topic_name": "Budget Planning", "topic_count": 5},
    ...
  ]
}
```

#### 6. Get Participant Analytics
**GET** `/api/analytics/participants`

Get participant engagement metrics.

**Response**:
```json
{
  "total_participants": 10,
  "participants": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@acme.com",
      "meetings_attended": 5,
      "action_items_assigned": 3,
      "topics_discussed": 12,
      "decisions_involved_in": 2
    },
    ...
  ]
}
```

## 📁 Project Structure

```
knowledge-extraction-api-/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── db.ts                 # PostgreSQL connection
│   │   ├── openai.service.ts    # OpenAI API integration
│   │   ├── schemas.ts            # Zod validation schemas
│   │   ├── schema.sql            # Database schema
│   │   └── routes/
│   │       ├── ingest.ts         # POST /api/ingest
│   │       ├── transcripts.ts    # GET /api/transcripts
│   │       ├── search.ts         # GET /api/search
│   │       ├── topics.ts         # GET /api/analytics/topics
│   │       └── participants.ts  # GET /api/analytics/participants
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with Navigation
│   │   ├── page.tsx              # Home page
│   │   ├── transcripts/
│   │   │   ├── page.tsx          # Transcript list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Transcript detail
│   │   ├── analytics/
│   │   │   └── page.tsx          # Analytics dashboard
│   │   └── search/
│   │       └── page.tsx          # Semantic search
│   ├── components/
│   │   ├── Navigation.tsx        # Top navigation
│   │   └── Footer.tsx            # Footer component
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   └── utils.ts              # Utility functions
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── package.json
│
├── docker-compose.yml            # PostgreSQL container config
├── .env                          # Backend environment variables (create this)
├── .gitignore
└── README.md
```

## 🏗 Architecture

### Backend Architecture

```
┌─────────────────┐
│   Express API   │
│   (Port 3000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│PostgreSQL│ │ OpenAI │
│ Database │ │   API   │
└─────────┘ └─────────┘
```

### Data Flow

1. **Ingestion**: Client sends transcript → Backend validates → OpenAI extracts entities → Database stores
2. **Search**: Client sends query → Backend generates embedding → Compares with stored embeddings → Returns top matches
3. **Analytics**: Client requests analytics → Backend queries database → Aggregates data → Returns statistics

### Database Schema

- **transcripts**: Main transcript data
- **participants**: Unique participants (deduplicated by email)
- **transcript_participants**: Many-to-many relationship
- **topics**: Topics discussed in each transcript
- **action_items**: Extracted action items
- **decisions**: Key decisions made
- **embeddings**: Vector embeddings for semantic search

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Database connection error
```
❌ Unexpected error on idle client
```
**Solution**:
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check DATABASE_URL in `.env` file
3. Ensure database exists: `docker exec -it CONTAINER_NAME psql -U dev -d knowledge_db -c "\l"`

**Problem**: OpenAI API errors
```
Error: API request failed
```
**Solution**:
1. Verify OPENAI_API_KEY in `.env` file
2. Check API key is valid and has credits
3. Verify network connectivity

**Problem**: Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**:
1. Change PORT in `.env` file
2. Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

### Frontend Issues

**Problem**: Cannot connect to backend
```
Failed to fetch
```
**Solution**:
1. Verify backend is running on port 3000
2. Check NEXT_PUBLIC_API_URL in `frontend/.env.local`
3. Verify CORS is enabled in backend (it is by default)

**Problem**: Port 3001 already in use
```
Error: Port 3001 is already in use
```
**Solution**:
1. Change port in `frontend/package.json` scripts
2. Or kill the process: `lsof -ti:3001 | xargs kill`

**Problem**: Build errors
```
Module not found
```
**Solution**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Next.js cache: `rm -rf frontend/.next`

### Database Issues

**Problem**: Schema not applied
```
relation "transcripts" does not exist
```
**Solution**:
1. Run the schema file: `docker exec -i CONTAINER_NAME psql -U dev -d knowledge_db < backend/src/schema.sql`
2. Verify tables exist: `docker exec -it CONTAINER_NAME psql -U dev -d knowledge_db -c "\dt"`

**Problem**: Migration errors
```
column "summary" does not exist
```
**Solution**:
1. The schema includes ALTER TABLE statements for new columns
2. Run the schema file again (it uses IF NOT EXISTS)

## 🧪 Testing the API

### Using cURL

**Health Check**:
```bash
curl http://localhost:3000/health
```

**Ingest Transcript** (Sample from requirements):
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "transcript_id": "meeting-001",
    "title": "Q4 Marketing Strategy Meeting",
    "occurred_at": "2025-10-15T14:00:00Z",
    "duration_minutes": 45,
    "participants": [
      {
        "name": "Sarah Chen",
        "email": "sarah@acme.com",
        "role": "speaker"
      },
      {
        "name": "Michael Rodriguez",
        "email": "mike@acme.com",
        "role": "speaker"
      },
      {
        "name": "Jennifer Lee",
        "email": "jen@acme.com",
        "role": "participant"
      }
    ],
    "transcript": "Sarah: Thanks everyone for joining. Let us dive into our Q4 marketing strategy. We need to discuss our budget allocation and campaign priorities. Michael: Absolutely. I have been reviewing our Q3 numbers, and I think we should increase our content marketing budget by 25%. Our blog posts have been generating significant leads. Jennifer: I agree with Mike. The data shows clear ROI. I would also suggest we explore influencer partnerships for our enterprise segment. Sarah: Great points. Let us make it official - we will increase content budget by 25% and allocate $50k for influencer partnerships. Mike, can you prepare a detailed breakdown by Friday? Michael: Absolutely, I will have it ready. Sarah: Perfect. One more thing - we need to decide on our target accounts for ABM campaigns. Jennifer, your thoughts? Jennifer: I have identified 15 high-value accounts in the healthcare and fintech sectors. I will share the list in Slack after this call. Sarah: Excellent. Let us reconvene next Tuesday to finalize the campaign roadmap. Thanks everyone!",
    "metadata": {
      "platform": "zoom",
      "recording_url": "https://zoom.us/rec/play/example"
    }
  }'
```

**Get Transcripts**:
```bash
curl http://localhost:3000/api/transcripts
```

**Get Single Transcript**:
```bash
curl http://localhost:3000/api/transcripts/1
```

**Search**:
```bash
curl "http://localhost:3000/api/search?q=budget%20discussions"
```

**Get Topics Analytics**:
```bash
curl http://localhost:3000/api/analytics/topics
```

**Get Participant Analytics**:
```bash
curl http://localhost:3000/api/analytics/participants
```

### Using the Frontend

1. Navigate to `http://localhost:3001`
2. Use the **Transcripts** page to view all transcripts
3. Use the **Search** page for semantic search
4. Use the **Analytics** page to view statistics
5. Click on any transcript card to view full details with entity highlighting

## 📝 Design Decisions

### Why Express.js over NestJS?
- Simpler setup for this project size
- Direct control over middleware
- Faster development iteration

### Why PostgreSQL over MongoDB?
- Better for relational data (participants, topics, transcripts)
- ACID compliance for data integrity
- Native support for complex queries

### Why Next.js App Router?
- Modern React patterns
- Built-in routing and layouts
- Server components support (future enhancement)
- Better performance

### Why OpenAI Embeddings?
- High-quality semantic search
- Easy integration
- Good performance for this use case

## 🚀 Production Deployment

### Backend Deployment

1. **Build the project**:
   ```bash
   cd backend
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server**:
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Set NEXT_PUBLIC_API_URL** to your production backend URL

3. **Deploy to Vercel/Netlify/Railway**:
   ```bash
   # Vercel
   vercel deploy
   
   # Or use the platform's dashboard
   ```
