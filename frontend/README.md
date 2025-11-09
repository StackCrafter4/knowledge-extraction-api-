# Knowledge Extraction API - Frontend

Next.js 14+ frontend application for the Knowledge Extraction API dashboard.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with dark mode support
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date formatting utilities

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utilities and API client
│   ├── api.ts          # Backend API integration
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the frontend folder:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Note:** 
- Backend uses the root `.env` file (for `DATABASE_URL`, `OPENAI_API_KEY`, `PORT`)
- Frontend uses `frontend/.env.local` (for `NEXT_PUBLIC_API_URL`)
- Next.js requires `NEXT_PUBLIC_` prefix for browser-accessible variables

3. Run development server:
```bash
npm run dev
```

The frontend will run on **port 3001** (backend runs on port 3000).

4. Open [http://localhost:3001](http://localhost:3001) in your browser

**Note:** Make sure your backend is running on `http://localhost:3000` before starting the frontend.

## Features

- ✅ Project setup with TypeScript and Tailwind CSS
- ✅ API client with type-safe endpoints
- ✅ Utility functions for formatting and UI helpers
- ✅ Type definitions for all API responses
- ✅ Dark mode support
- 🔄 Transcript List page (Next step)
- 🔄 Transcript Detail page (Next step)
- 🔄 Analytics Dashboard (Next step)
- 🔄 Semantic Search page (Next step)

## API Integration

The frontend connects to the backend API at `http://localhost:3000` by default. All API calls are handled through the `lib/api.ts` file with proper TypeScript types.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
