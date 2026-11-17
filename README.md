# CampusQuiz — Online Quiz & Automatic Evaluation System Using Finite Automata

**University project:** 22ITT51 Full Stack Web Development · 22ITT52 Computer Networks · 22ITT53 Formal Languages and Automata Theory  
**Stack:** React + Vite, Node.js, Express, MongoDB + Mongoose

A runnable MERN starter implementation with separate administrator/student roles, 15 quiz sets (5 per subject), 25 questions per set (375 question records), server-side evaluation, and an explicit finite-state-machine transition validator.

## 1. Features
- Student registration and login; administrator login.
- Dashboard attempt history with marks, percentage, pass status, submitted date/time and time taken; admin can view all students’ attempts.
- Role-protected administrator overview and student directory.
- FSWD, CN and FLAT subject catalogue; five sets per subject.
- 25 MCQs per set, question navigation, answer selection, 20-minute countdown.
- Server-side answer checking; score, percentage and pass status stored in MongoDB.
- Quiz lifecycle FSM: READY → ACTIVE → EVALUATING → COMPLETED; invalid transitions rejected.
- Form validation, password hashing, JWT authentication, API rate limiting.
- Documentation and editable SVG diagrams for CN and FLAT.

## 2. Requirements
- Node.js 20 or later (Node 20+ recommended)
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## 3. Run locally
Open two terminals.

### Terminal A — backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set a strong JWT_SECRET and your MongoDB URI.
npm run seed
npm run dev
```
Backend: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### Terminal B — frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

### First administrator login
The seed script creates/updates the admin account from `backend/.env`:
- Email: `admin@college.edu`
- Password: `Admin@12345`

Change these values in `.env` before seeding for any real deployment. Do not publish `.env` or real credentials to GitHub.

Students can register from the login page. Admin accounts must be created by the seed script or directly by a trusted database administrator; public registration always creates a student role.

## 4. Quiz bank
`backend/src/data/questions.json` contains 375 question records:
- FSWD: 5 sets × 25
- CN: 5 sets × 25
- FLAT: 5 sets × 25

The question bank is provided as a project demonstration bank. Review and customize questions and explanations against your university syllabus before final assessment submission. Correct answers are kept server-side and are not returned by the quiz fetch API.

## 5. API summary
All routes are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health |
| POST | `/auth/register` | Student registration |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current token identity |
| GET | `/quizzes/catalog` | Subject and set catalogue |
| GET | `/quizzes/:subject/:setNumber` | Fetch public quiz questions |
| POST | `/quizzes/submit` | Server-side evaluation and persistence |
| GET | `/quizzes/attempts/mine` | Current student's attempts |
| GET | `/quizzes/admin/overview` | Admin counts and subject summary |
| GET | `/quizzes/admin/attempts` | Admin attempt report |
| GET | `/quizzes/admin/students` | Student directory |


## 5A. Route-order fix (dashboard history)
Specific endpoints such as `/quizzes/attempts/mine`, `/quizzes/admin/attempts`, and
`/quizzes/admin/students` are declared before the generic
`/quizzes/:subject/:setNumber` endpoint. This prevents Express from interpreting
`attempts/mine` as a subject/set pair and incorrectly returning `Quiz set not found`.

## 6. Evaluation rule
Each correct answer = 1 mark. Total = 25. Percentage = score × 4. The demonstration pass threshold is 13/25 (52%); change this rule if your department specifies another threshold.

## 7. FSM definition
States: READY, ACTIVE, EVALUATING, COMPLETED, CANCELLED.  
Events: START, NEXT, PREVIOUS, SELECT_ANSWER, SUBMIT, TIMEOUT, EVALUATION_COMPLETE, VIEW_RESULT, CANCEL.  
The UI controls question position; the backend independently validates lifecycle transitions and performs evaluation. See `documentation/FLAT/`, including `transition-diagram.svg` and `transition-table.svg`.

## 8. Network model (local demonstration)
- Browser client: `127.0.0.1` or `localhost` on the developer machine.
- Express server: `127.0.0.1:5000`.
- Vite development server: `127.0.0.1:5173`.
- MongoDB: `127.0.0.1:27017`.
- Application protocol: HTTP for local development; HTTPS should be enabled through a reverse proxy/TLS certificate in production.
- Transport: TCP. Port 5000 is the Express API listener; 5173 is the Vite dev server; 27017 is MongoDB's default listener.
See `documentation/CN/`.

## 9. GitHub submission
1. Create a private/public individual repository as instructed by your department.
2. Add the project files; do not add `node_modules`, `.env`, build output, or secrets.
3. Commit source and documentation.
4. Add your own name, register number, department, college and faculty guide to the report cover page.
5. Test the app on a clean machine and capture genuine running screenshots.

## 10. Important academic notes
This is a runnable academic project baseline, not a production-certified examination system. Before deployment, add HTTPS, stronger session lifecycle and server-side attempt timing, audit logs, backups, accessibility review, and institutional approval. The timer in this demo is a client-side convenience; a high-stakes exam should enforce deadlines on the server.
