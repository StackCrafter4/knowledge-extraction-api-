# Frontend Setup Guide

## Port Configuration

- **Backend API**: Runs on `http://localhost:3000`
- **Frontend**: Runs on `http://localhost:3001`

This avoids port conflicts when running both services simultaneously.

## Quick Start

1. **Start the Backend** (in a separate terminal):
   ```bash
   cd backend
   npm run dev
   ```
   Backend will be available at `http://localhost:3000`

2. **Start the Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:3001`

3. **Configure Environment Variables**:
   
   The backend uses the root `.env` file (in the project root) for:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `PORT` (defaults to 3000)
   
   For the frontend, create `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   
   **Note:** Next.js requires frontend environment variables to be prefixed with `NEXT_PUBLIC_` to be accessible in the browser. These should be in the frontend folder, while backend variables remain in the root `.env`.

## Running Both Services

You can run both services in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verification

1. Check backend is running: `http://localhost:3000/health`
2. Check frontend is running: `http://localhost:3001`
3. Frontend will automatically connect to backend at `http://localhost:3000`

## Troubleshooting

- **Port already in use**: Make sure port 3000 is available for backend and port 3001 for frontend
- **CORS errors**: Backend has CORS enabled, so this should work out of the box
- **API connection errors**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` points to `http://localhost:3000`

