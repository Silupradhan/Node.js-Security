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

cookie : 

httpOnly : 
- javaScript can not read the cookie
- project authentication cookies from xss

secure :
- Send cookie only over HTTPS
- Protect cookie while traveling over the network

sameSite :
- Controls when cookie is sent with cross-site requests
- Helps prevent CSRF

maxAge : 
- How long cookie lives
- Automatically expires cookie after a duration

Access Token : token are used to verify the request user is valid or not before access their resourses
Refresh Token : A refresh token is a special, long-lived token used in our application get a new access token 

XSS → attacker tries to run JavaScript in your website.

CSRF → attacker tries to make your browser send a request to your website.

cors : CORS controls which websites are allowed to request data from your backend.


