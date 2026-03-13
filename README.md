# FireDump

FireDump is a Vercel-friendly Next.js app that exports a Firestore collection into a downloadable JSON file.

## Features

- English-first landing page for the FireDump MVP
- Server-side Firestore export through `firebase-admin`
- Immediate JSON download from a single form submission
- No credential persistence in the app layer

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Deploy directly to Vercel as a standard Next.js application.
