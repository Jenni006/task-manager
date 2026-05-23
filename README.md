# Task Manager

A minimal, responsive full-stack task management application built with **FastAPI** and **React**.
The application includes secure JWT authentication, task CRUD operations, filtering, pagination, Docker support, and live deployment using Railway and Vercel.

Developed as part of the Python Developer Intern assignment for **Weboin Technologies**.

---

## How to Use

### 1. Register
Go to the app URL and create an account by entering your email, username, and password.

### 2. Login
Sign in with your email and password. You will be redirected to your task dashboard.

### 3. Add a Task
Type a task title in the input field at the top of the dashboard and click **Add**. The task appears in your list immediately.

### 4. Complete a Task
Click the checkbox next to any task to mark it as completed. Completed tasks appear with a strikethrough.

### 5. Filter Tasks
Use the **All / Active / Completed** toggle at the top right of the dashboard to filter your task list.
- **All** — shows every task
- **Active** — shows only incomplete tasks
- **Completed** — shows only finished tasks

### 6. Delete a Task
Hover over any task row to reveal the **Delete** button on the right. Click it to permanently remove the task.

### 7. Sign Out
Click **Sign out** in the top right corner of the navbar to end your session.

---
 
## Live Demo
 
- Frontend: https://task-manager-tau-seven-57.vercel.app
- Backend API: https://task-manager-production-b3be.up.railway.app/
- API Docs: https://task-manager-production-b3be.up.railway.app/docs
---
 
## Tech Stack
 
**Backend**
- FastAPI
- SQLAlchemy + SQLite
- JWT authentication (python-jose)
- Password hashing (passlib + bcrypt)
- Pydantic v2
**Frontend**
- React + Vite
- Tailwind CSS
- Axios
**Infrastructure**
- Docker + Docker Compose
- Backend deployed on Railway
- Frontend deployed on Vercel
---
 
## Project Structure
 
```
task-manager/
├── backend/
│   ├── app/
│   │   ├── auth/              # JWT handling, password hashing, route dependencies
│   │   ├── models/            # SQLAlchemy models (User, Task)
│   │   ├── routes/            # API route handlers (auth, tasks)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # Database query logic
│   │   ├── config.py          # Environment variable settings
│   │   ├── database.py        # SQLAlchemy engine and session
│   │   └── main.py            # App entry point
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   └── test_tasks.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client, auth and task API calls
│   │   ├── components/        # Navbar, TaskForm, TaskList
│   │   ├── context/           # Auth context and token management
│   │   ├── pages/             # Login, Register, Tasks
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
└── docker-compose.yml
```
 
---
 
## API Endpoints
 
### Authentication
 
| Method | Endpoint  | Description         | Auth Required |
|--------|-----------|---------------------|---------------|
| POST   | /register | Register a new user | No            |
| POST   | /login    | Login, receive JWT  | No            |
 
### Tasks
 
| Method | Endpoint    | Description                      | Auth Required |
|--------|-------------|----------------------------------|---------------|
| POST   | /tasks      | Create a task                    | Yes           |
| GET    | /tasks      | List tasks (filter + pagination) | Yes           |
| GET    | /tasks/{id} | Get a single task                | Yes           |
| PUT    | /tasks/{id} | Update title, description, status| Yes           |
| DELETE | /tasks/{id} | Delete a task                    | Yes           |
 
**Query parameters for GET /tasks:**
- `?completed=true` or `?completed=false` — filter by status
- `?page=1&limit=10` — pagination
---
 
## Environment Variables
 
### Backend (`backend/.env`)
 
| Variable                    | Description                            | Example                     |
|-----------------------------|----------------------------------------|-----------------------------|
| APP_NAME                    | Application name                       | TaskManager                 |
| SECRET_KEY                  | JWT signing secret (keep this private) | a3f9...                     |
| ALGORITHM                   | JWT algorithm                          | HS256                       |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiry duration in minutes       | 30                          |
| DATABASE_URL                | SQLAlchemy database connection string  | sqlite:///./taskmanager.db  |
| ALLOWED_ORIGINS             | Comma-separated allowed CORS origins   | https://your-app.vercel.app |
 
Copy `backend/.env.example` and fill in your values:
 
```bash
cp backend/.env.example backend/.env
```
 
### Frontend (`frontend/.env`)
 
| Variable     | Description      | Example                                 |
|--------------|------------------|-----------------------------------------|
| VITE_API_URL | Backend base URL | https://your-railway-url.up.railway.app |
 
Copy `frontend/.env.example` and fill in your values:
 
```bash
cp frontend/.env.example frontend/.env
```
 
---
 
## Running Locally
 
### Prerequisites
 
- Python 3.11+
- Node.js 20+
- Git
### 1. Clone the repository
 
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```
 
### 2. Backend setup
 
```bash
cd backend
 
python -m venv venv
 
# macOS/Linux
source venv/bin/activate
 
# Windows
venv\Scripts\activate
 
pip install -r requirements.txt
 
cp .env.example .env
# Edit .env and set your SECRET_KEY
 
uvicorn app.main:app --reload
```
 
Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs
 
### 3. Frontend setup
 
Open a new terminal:
 
```bash
cd frontend
 
cp .env.example .env
# .env already points to http://localhost:8000
 
npm install
npm run dev
```
 
Frontend runs at: http://localhost:5173
 
---
 
## Running with Docker
 
Make sure Docker Desktop is running.
 
```bash
# From project root
docker-compose up --build
```
 
- Frontend: http://localhost:80
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
```bash
# Stop containers
docker-compose down
```
 
---
 
## Running Tests
 
```bash
cd backend
 
# Activate virtual environment first
source venv/bin/activate  # or venv\Scripts\activate on Windows
 
pytest tests/ -v
```
 
The test suite covers:
 
- User registration and login
- Duplicate email and username handling
- JWT-protected route access
- Task creation, retrieval, update, and deletion
- Pagination and filtering
- Cross-user task access prevention
---
 
## Known Limitations
 
- SQLite is used for simplicity. The Railway filesystem resets on redeploy, which clears the database. For persistent production storage, replace SQLite with Railway's PostgreSQL plugin and update `DATABASE_URL` accordingly.
- JWT tokens are stored in `localStorage`. For a stricter security model, `httpOnly` cookies would be preferable.
---
 
## Deployment
 
### Backend — Railway
 
1. Create a project on [Railway](https://railway.app) from your GitHub repo
2. Set root directory to `backend`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add all environment variables from the table above
5. Railway auto-deploys on every push to `main`
### Frontend — Vercel
 
1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app`
4. Vercel auto-deploys on every push to `main`
After both are deployed, update `ALLOWED_ORIGINS` in Railway to your Vercel URL.
