# Node.js Security Backend

## Structure

```text
src/
├── config/
│   └── database.ts
├── routes/
│   └── health.routes.ts
├── app.ts
└── server.ts
```

## Setup

1. Make sure MongoDB is running locally.
2. Copy `.env.example` to `.env` and update the values if needed.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The application connects to the `nodejs_security` database and creates an
`application_metadata` collection on startup so MongoDB creates the database.

## Endpoints

- `GET /` - API status
- `GET /api/health` - API and MongoDB connection status
