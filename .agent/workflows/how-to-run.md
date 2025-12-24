---
description: how to run the RECIPIO AI application
---

To run the RECIPIO AI application, you need to start both the backend (Django) and the frontend (Vite/React).

### 1. Backend Setup (Django)
Open a new terminal and navigate to the `backend` directory.

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Run Migrations
```bash
python manage.py migrate
```

#### Start the Server
```bash
python manage.py runserver
```
The backend will be running at `http://127.0.0.1:8000/`.

### 2. Frontend Setup (React/Vite)
Open a separate terminal and navigate to the `frontend` directory.

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start the Development Server
```bash
npm run dev
```
The frontend will be running at `http://localhost:5173/` (or similar, check the terminal output).

### 3. Usage
- Go to `http://localhost:5173/` in your browser.
- You can now register, log in, and start creating recipes!

> [!NOTE]
> Make sure both servers are running simultaneously for the application to function correctly.
