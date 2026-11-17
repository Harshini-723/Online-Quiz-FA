# 22ITT51 — Full Stack Web Development

## Architecture
React/Vite renders the client interface. Axios calls REST endpoints exposed by Express. Express validates input, authenticates JWTs, applies role checks, invokes the quiz FSM, evaluates submitted answers, and uses Mongoose to persist users and attempts in MongoDB.

## Modules
1. Authentication: student registration, login, bcrypt password hashing, JWT.
2. Admin: overview metrics, student directory, attempt reporting endpoint.
3. Student: subject catalogue, set selection, timed MCQ interface, results and attempt history.
4. Quiz service: question delivery without answer keys, submission validation, server-side scoring.
5. Data: User and Attempt Mongoose models plus a version-controlled JSON question bank.

## Validation
- Registration requires a non-empty name, syntactically valid email and password of at least 8 characters.
- Duplicate email returns HTTP 409.
- Login failure returns HTTP 401 without disclosing whether email exists.
- Quiz submission requires a supported subject, set number 1–5 and exactly 25 answer entries.
- Server computes marks from its own question bank; client-submitted scores are never trusted.
- Protected routes require a valid JWT; admin endpoints require role=admin.

## Sample input/output
Registration input:
```json
{"name":"Asha Kumar","email":"asha@college.edu","password":"Student@123"}
```
Successful login response (token abbreviated):
```json
{"token":"<JWT>","user":{"name":"Asha Kumar","email":"asha@college.edu","role":"student"}}
```
Submission input:
```json
{"subject":"CN","setNumber":1,"answers":[{"questionNumber":1,"selectedIndex":2}]}
```
The real endpoint requires 25 entries. Example response:
```json
{"subject":"CN","setNumber":1,"score":20,"total":25,"percentage":80,"status":"Passed","state":"COMPLETED"}
```

## Run and test
Follow the root README. Check `/api/health`, register a student, select a set, answer questions and submit. Use browser developer tools Network tab to inspect HTTP request/response status codes.
