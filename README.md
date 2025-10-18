# ReachInbox-Assignment

A full-stack email management application with Node.js backend and modern UI frontend.

## Overview

This workspace contains a simple backend (Node + TypeScript) and a frontend interface.

## Quick start (Windows PowerShell)

1. Start docker services (Elasticsearch, Kibana, Postgres):

```powershell
cd C:\Users\vhari\OneDrive\Desktop\onebox
docker-compose up -d
```

2. Install dependencies (root/backends):

```powershell
cd C:\Users\vhari\OneDrive\Desktop\onebox\backend
npm install
```

3. Build and start backend:

```powershell
npm run build
node dist/server.js
```

By default backend listens on port 3001 (configured in `backend/.env`).

4. Serve frontend (simple static server):

```powershell
cd C:\Users\vhari\OneDrive\Desktop\onebox\frontend
npx http-server . -p 8080
```

Open http://localhost:8080 in your browser.

## Notes
- If port 3001 is in use, stop the process or change PORT in `backend/.env`.
- The frontend provides a modern UI interface for email management
