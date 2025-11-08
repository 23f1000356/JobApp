# Linkden — LinkedIn-style App (Frontend + Backend)

This repository contains a React + TypeScript frontend (Vite) and a Node.js + Express backend with MongoDB for data storage. The project implements authentication, posts (create/edit/delete), comments, likes, shares, image uploads (Cloudinary), and user profiles/connections.

## Repository layout

- `/project` — Frontend (Vite + React + TypeScript). Run this for the web app.
- `/backend` — Backend (Node.js + Express + Mongoose). Run this to provide the API and image upload service.
- `/supabase` — (optional) existing supabase migrations (not used if you use the provided backend)


## Prerequisites

- Node.js 18+ (or latest LTS)
- npm (comes with Node.js) or yarn
- MongoDB instance (Atlas or local)
- Cloudinary account (optional, for image uploads)


## Environment variables

You must add environment variables for both frontend and backend.

Frontend (project): create `project/.env` with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# If you use the Node backend instead of Supabase, you'll have an API base URL in the frontend API helper (see below).
```

Backend (`backend/.env`): create `backend/.env` with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Notes:
- If you do not want Cloudinary, you can adapt the upload code to store images elsewhere (S3/local) and remove Cloudinary keys.
- Make sure `MONGODB_URI` is a valid connection string (MongoDB Atlas or local: e.g., `mongodb://localhost:27017/linkden`).


## Install & run (development)

Open TWO terminals (one for backend, one for frontend):

1) Backend

```powershell
cd backend
npm install
# put your backend env vars into backend/.env
npm run dev
```

Backend will listen on port 5000 by default (`http://localhost:5000`). The API prefix used by the frontend is `/api` (e.g. `http://localhost:5000/api/auth/register`).

2) Frontend

```powershell
cd project
npm install
# put your frontend env vars into project/.env (Vite picks up VITE_* variables)
npm run dev
```

Frontend will start using Vite (default: `http://localhost:5173` or the next free port).


## Quick API summary (backend)

All backend endpoints are prefixed with `/api`.

Auth
- POST /api/auth/register — register a new user
	- body: { name, username, email, password }
	- returns user object + token

- POST /api/auth/login — login
	- body: { email, password }
	- returns user object + token

Users
- GET /api/users/:id — get a user's profile and posts (protected)
- PUT /api/users/:id — update user profile (protected, only the owner)
- POST /api/users/:id/connect — send connection request (protected)
- PUT /api/users/:id/accept — accept a connection request (protected)
- GET /api/users/:id/connections — list connections (protected)

Posts
- POST /api/posts — create a post (protected)
	- body: { content, image } (image can be URL returned from upload endpoint)

- GET /api/posts — list posts (protected)

- PUT /api/posts/:id — update a post (protected, author only)

- DELETE /api/posts/:id — delete a post (protected, author only)

- PUT /api/posts/:id/like — toggle like/unlike (protected)

- POST /api/posts/:id/comment — add a comment (protected) — body: { content }

- POST /api/posts/:id/share — share the post (protected)

Uploads
- POST /api/upload — upload an image (protected, form-data: field `image`) — returns `{ url, publicId }`
- DELETE /api/upload/:publicId — delete an uploaded image (protected)


## Frontend notes & configuration

- The frontend expects an API client helper that adds the JWT token to the `Authorization: Bearer <token>` header. A helper `src/lib/api.ts` was added in the repository root previously. If your Vite frontend is in `/project`, ensure you either:
	- copy or create `project/src/lib/api.ts` and set `baseURL` to your backend: `http://localhost:5000/api`, OR
	- update the API path used by your components to match backend URL.

- When a user signs up or logs in, store the received `token` in `localStorage` (or a secure client store) and the frontend API helper will attach it to requests.

- Frontend routing: root is `/feed`. Protected routes require an auth context to read the user and token. The `AuthContext` currently uses Supabase — if you switch to the Node/Mongo backend's auth flow (JWT), you should adapt the `AuthContext` to use the backend login/register endpoints and store the JWT.


## Example requests (curl)

Register (backend):

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"John Doe","username":"johndoe","email":"john@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"john@example.com","password":"password123"}'
```

Create post (use token from login):

```bash
curl -X POST http://localhost:5000/api/posts \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer YOUR_JWT_TOKEN" \
	-d '{"content":"Hello world!","image":"https://res.cloudinary.com/..../image.jpg"}'
```

Upload image using the upload endpoint (example using `curl` for form-data):

```bash
curl -X POST http://localhost:5000/api/upload \
	-H "Authorization: Bearer YOUR_JWT_TOKEN" \
	-F "image=@/path/to/local/image.jpg"
```


## Functionalities implemented

- User authentication (register, login) with JWT.
- User profiles: view and edit profile information, profile picture and cover picture.
- Posts: create, edit, delete posts with optional image.
- Interactions: like/unlike, comment, share posts.
- Connections: send and accept connection requests, list connections.
- Image uploads via Cloudinary (Multer -> Cloudinary pipeline).


## Troubleshooting

- Port conflicts: If Vite reports port in use, it will try the next port (e.g., 5174). You can specify a port in `project/package.json` scripts or run `npm run dev -- --port 5173`.

- CORS: Backend uses `cors()` by default. If you get CORS errors, ensure the frontend origin is allowed or set specific origin in `backend/server.js`.

- Environment variables: Both frontend and backend must have the correct env variables. Vite requires `VITE_` prefix for environment variables the client can access.


## Next steps / suggestions

- Wire the frontend `AuthContext` to use the backend JWT login/register flow (instead of Supabase) if you prefer the Node backend as the primary auth provider.
- Add tests for the backend routes (supertest/mocha or jest).
- Add form validation on frontend for all forms.
- Add pagination/feeds, searching, and notifications.


## Contact / help

If you want, I can:
- Wire the `project` frontend to call the backend auth endpoints (update `AuthContext`),
- Create `project/src/lib/api.ts` if it is missing and update components to use it,
- Add example feed UI wired to the backend endpoints.

Tell me which of the above you'd like next and I'll implement it.