# Blog CMS – iTSikhwal Technologies

A modern Content Management System (CMS) built for managing blogs at **iTSikhwal Technologies**. The CMS provides a secure admin dashboard for content management along with public REST APIs that can be integrated into any website.

---

# Features

## Authentication
- JWT Authentication
- Secure Admin Login
- Protected Routes

## Dashboard
- CMS Overview
- Blog Statistics
- Category Statistics

## Blog Management
- Create, Edit & Delete Blogs
- Draft & Publish Workflow
- Archive & Restore Blogs
- Featured Blogs
- Reading Time Calculation

## Category Management
- Create, Update & Delete Categories

## Image Management
- Cloudinary Image Upload & Delete

## Public APIs
- Featured Blogs
- Recent Blogs
- Blog Listing
- Blog Details
- Categories
- Search
- Pagination

## SEO Support
- Meta Title
- Meta Description
- Keywords
- Canonical URL

---

# Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT Authentication

### Frontend
- React.js
- Vite
- Axios

### Storage
- Cloudinary

---

# Project Structure

```
CMS
│
├── backend
│   ├── alembic
│   ├── app
│   ├── scripts
│   ├── .env
│   ├── alembic.ini
│   ├── requirements.txt
│   └── README.md
│
└── frontend
    ├── public
    ├── src
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

# Prerequisites

### Backend

- Python 3.11+
- PostgreSQL Database (or Neon PostgreSQL)

### Frontend

- Node.js 18+
- npm

---

# Clone Repository

```bash
git clone <repository-url>
cd CMS
```

---

# Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create Virtual Environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
DATABASE_URL=

SECRET_KEY=

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

### 5. Run Database Migrations

```bash
alembic upgrade head
```

---

### 6. Create Initial Admin Account

Update the required admin details inside the seed script (if needed), then run:

```bash
python scripts/seed_admin.py
```

This creates the initial administrator account used to access the CMS Dashboard.

---

### 7. Start Backend

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open a new terminal.

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Start Frontend

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Running the CMS

Start both applications.

### Backend

```bash
cd backend

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm run dev
```

---

# Application URLs

| Service | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://127.0.0.1:8000 |
| Swagger API Docs | http://127.0.0.1:8000/docs |

---

# Public APIs

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/public/blogs` | Get paginated blogs |
| GET | `/api/public/blogs/featured` | Get featured blogs |
| GET | `/api/public/blogs/recent` | Get recent blogs |
| GET | `/api/public/blogs/{slug}` | Get blog details |
| GET | `/api/public/categories` | Get categories |

---

# Admin Features

After logging in, administrators can:

- Manage Blogs
- Manage Categories
- Upload Images
- Publish Blogs
- Save Drafts
- Archive & Restore Blogs
- View Dashboard Statistics

---

# Website Integration

The CMS is designed independently of the company website.

Any frontend application can consume the Public APIs to build:

- Homepage Featured Blogs
- Blog Listing Page
- Blog Detail Page
- Recent Blogs Section
- Dynamic Categories
- Search & Pagination

---

# Future Enhancements

- Rich Text Editor
- Scheduled Publishing
- Author Profiles
- Newsletter Integration
- RSS Feed
- Blog Analytics
- Comments
- Tags
- Media Library

---

# Developer

**Suhasi Bari**

Built as part of the Full Stack Development Internship at **iTSikhwal Technologies**.
