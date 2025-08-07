# 📝 Real-Time Notes App

Real-time Notes App – A full-stack notes-taking app built with Next.js, Express, and PostgreSQL. Features real-time sync via Socket.IO, JWT authentication, auto-save, markdown support, and tag-based filtering.

- **Frontend:** Next.js + Socket.IO
- **Backend:** Express.js + PostgreSQL + Socket.IO
- **Database:** PostgreSQL

## 🔧 Setup

1. **Setup DB**

   - Run: `script.sql` from `D:\abhay\notesApp\backend\database\script.sql` in your PostgreSQL DB

2. **Start Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

- Backend runs on: `http://localhost:3500`
- Frontend runs on: `http://localhost:3000`

## ✅ Features

- Real-time note sync (Socket.IO)
- Auto-save with debounce
- Tag filtering & search
- jwt
