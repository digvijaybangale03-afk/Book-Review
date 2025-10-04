# Book Review Platform - Complete Submission

This repository contains a minimal but complete MERN app for the Book Review assignment:
- Backend: `backend/` (Express, MongoDB, Mongoose, JWT, bcrypt)
- Frontend: `frontend/` (React)

## Quick start (local)
1. Install Node.js (v16+), MongoDB (or use Atlas).
2. Clone or extract this project.
3. Backend:
   - Copy `backend/.env.example` -> `backend/.env`
   - Fill `MONGO_URI` (mongodb://localhost:27017/bookreview or Atlas URI) and `JWT_SECRET`
   - Install & run:
     ```
     cd backend
     npm install
     npm run dev
     ```
4. Frontend:
   - Update frontend `package.json` proxy if backend is on different port, or set axios baseURL.
   - Install & run:
     ```
     cd frontend
     npm install
     npm start
     ```
5. Open `http://localhost:3000` for frontend.

## Deployment (suggested)
### MongoDB Atlas
1. Create Atlas account and cluster.
2. Create database user and whitelist IP / use 0.0.0.0/0 for testing.
3. Copy connection string and put into `MONGO_URI`.

### Deploy backend to Render / Heroku
- Render: Create new Web Service, connect repo, set build command `npm install` and start command `npm start`. Add env vars `MONGO_URI` and `JWT_SECRET`.
- Heroku: `heroku create`, set env vars, `git push heroku main`.

### Deploy frontend to Vercel or Netlify
- Vercel: import frontend folder, build command `npm run build`, set output `build`.
- If backend is deployed on different domain, update axios base URL in `src/utils_auth` or set a runtime environment variable.

## API endpoints (examples)
- POST /api/auth/signup {name,email,password}
- POST /api/auth/login {email,password} -> returns {token, user}
- GET /api/books?page=1
- GET /api/books/:id
- POST /api/books (protected)
- PUT /api/books/:id (protected)
- DELETE /api/books/:id (protected)
- POST /api/reviews (protected) {bookId,rating,reviewText}
- PUT /api/reviews/:id (protected)
- DELETE /api/reviews/:id (protected)

## Deliverables checklist (for submission)
- [x] JWT auth with bcrypt (backend)
- [x] CRUD for books with ownership checks
- [x] Reviews system (rating 1-5 and text)
- [x] Pagination (5 books per page)
- [x] Average ratings computed & returned
- [x] Frontend pages (Signup, Login, Book list, Book details, Add/Edit)
- [ ] Bonus: charts, search/sort, deployment (instructions provided)

## Postman collection
A small Postman collection `postman_collection.json` included in repo root.

---

If you want, I can:
- Add Dockerfiles for backend & frontend
- Add a small CI or Render ready `render.yaml`
- Improve UI (Tailwind/Bootstrap) and add search & charts
- Prepare a demo deployment (I cannot deploy on your behalf, but I can give exact steps & commands)

