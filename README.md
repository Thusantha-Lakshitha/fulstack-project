# 🎓 TL-Education — Online Learning Platform

A full-stack online education platform built with **React** (frontend) and **Spring Boot** (backend), connected to **MongoDB Atlas** cloud database.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [1. Clone / Open the Project](#1-clone--open-the-project)
  - [2. Run the Backend](#2-run-the-backend-spring-boot)
  - [3. Run the Frontend](#3-run-the-frontend-react)
- [MongoDB Atlas Configuration](#-mongodb-atlas-configuration)
- [API Endpoints](#-api-endpoints)
- [Available Pages](#-available-pages)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

| Layer      | Technology                          | Version       |
|------------|-------------------------------------|---------------|
| Frontend   | React                               | 19.2.5        |
| Routing    | React Router DOM                    | 6.30.3        |
| HTTP       | Axios                               | 1.16.0        |
| Icons      | React Icons, React Feather          | 5.6.0 / 2.0.10|
| Backend    | Spring Boot                         | 4.0.6         |
| Database   | MongoDB Atlas (Cloud)               | —             |
| Security   | Spring Security                     | —             |
| Build      | Maven (via wrapper)                 | 3.9.14        |
| Java       | OpenJDK (Temurin)                   | 21+           |
| Node.js    | Node.js                             | 18+           |

---

## ✅ Prerequisites

Before running the project, make sure you have these installed:

| Software   | Minimum Version | Check Command            | Download Link                                      |
|------------|-----------------|--------------------------|-----------------------------------------------------|
| **Java**   | JDK 21+         | `java -version`          | [Eclipse Temurin](https://adoptium.net/)            |
| **Node.js**| 18+             | `node --version`         | [Node.js](https://nodejs.org/)                      |
| **npm**    | 9+              | `npm --version`          | Comes with Node.js                                  |

> **Note:** Maven is NOT required — the project includes a Maven Wrapper (`mvnw.cmd`).

---

## 📁 Project Structure

```
online_education/
│
├── Backend/                          # Spring Boot Backend
│   ├── src/main/java/com/example/demo/
│   │   ├── DemoApplication.java      # Main entry point
│   │   ├── config/
│   │   │   ├── MongoDBConfig.java     # MongoDB Atlas connection config
│   │   │   └── SecurityConfig.java    # Spring Security + CORS config
│   │   ├── controller/
│   │   │   ├── AuthController.java    # POST /api/auth/register
│   │   │   ├── AutherController.java  # POST /api/auth/login
│   │   │   ├── UserController.java    # POST /api/users/register
│   │   │   └── DatabaseController.java# GET /api/db/check, /api/db/users
│   │   ├── model/
│   │   │   ├── User.java             # User document model
│   │   │   └── Course.java           # Course document model
│   │   ├── repository/
│   │   │   ├── UserRepository.java   # MongoDB user repository
│   │   │   └── CourseRepository.java  # MongoDB course repository
│   │   ├── Service/
│   │   │   ├── AuthService.java      # Login authentication logic
│   │   │   ├── UserService.java      # User registration logic
│   │   │   └── CourseService.java    # Course business logic
│   │   └── dto/
│   │       └── LoginRequest.java     # Login request DTO
│   ├── src/main/resources/
│   │   └── application.properties    # MongoDB URI, server port, CORS
│   ├── pom.xml                       # Maven dependencies
│   └── mvnw.cmd                      # Maven Wrapper (Windows)
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── App.js                    # Main app with routes
│   │   ├── index.js                  # React entry point
│   │   ├── index.css                 # Global styles
│   │   ├── components/
│   │   │   ├── navbar.js / .css      # Top navigation bar
│   │   │   └── footer.js / .css      # Footer component
│   │   ├── pages/
│   │   │   ├── Dashbord.js / .css    # Home / landing page
│   │   │   ├── course.js / .css      # Courses listing
│   │   │   ├── courseData.js         # Static course data
│   │   │   ├── CourseView.js / .css  # Single course detail
│   │   │   ├── Teacher.js / .css     # Teachers listing
│   │   │   ├── TeacherName.js        # Static teacher data
│   │   │   ├── About.js / .css       # About Us page
│   │   │   ├── contact.js / .css     # Contact Us with form + map
│   │   │   ├── Login.js / .css       # Student login
│   │   │   ├── Register.js / .css    # Student registration
│   │   │   ├── enroll.js / .css      # Course enrollment form
│   │   │   ├── SearchResults.js/.css # Search results page
│   │   │   └── ReadMore.js / .css    # Company details page
│   │   └── services/
│   │       ├── authService.js        # Register API call
│   │       └── userService.js        # Login/Register API calls
│   └── package.json                  # NPM dependencies
│
└── README.md                         # This file
```

---

## 🚀 Getting Started

### 1. Clone / Open the Project

Open a terminal and navigate to the project root:

```bash
cd C:\Users\USER\Desktop\online_education
```

---

### 2. Run the Backend (Spring Boot)

Open a **terminal** and run:

```bash
cd Backend
.\mvnw.cmd clean spring-boot:run -DskipTests
```

**What happens:**
- Maven downloads dependencies (first time takes 2–3 minutes)
- Spring Boot starts on **http://localhost:8080**
- Connects to MongoDB Atlas automatically
- You should see: `Started DemoApplication in X seconds`

**Verify it's running:**

Open your browser and go to:
```
http://localhost:8080/api/db/check
```

You should see:
```json
{"connected": true, "database": "EduLMS", "message": "MongoDB connection successful"}
```

> ⚠️ **Keep this terminal open** — the backend must stay running.

---

### 3. Run the Frontend (React)

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm start
```

**What happens:**
- `npm install` installs all Node.js dependencies (first time takes 1–2 minutes)
- `npm start` launches the React dev server on **http://localhost:3000**
- Your browser should open automatically

> ⚠️ **Keep this terminal open** — the frontend dev server must stay running.

---

### ✅ Both Running?

| Service   | URL                           | Status |
|-----------|-------------------------------|--------|
| Frontend  | http://localhost:3000          | React app |
| Backend   | http://localhost:8080          | Spring Boot API |
| DB Check  | http://localhost:8080/api/db/check | MongoDB status |
| Swagger   | http://localhost:8080/swagger-ui.html | API docs |

---

## 🍃 MongoDB Atlas Configuration

The backend now reads MongoDB settings from the root `.env` file when present.

Copy `.env.example` to `.env` and set your Atlas URI there:

```properties
MONGODB_URI=your-mongodb-atlas-uri-here
APP_MONGO_DATABASE=Education
FRONTEND_ORIGIN=http://localhost:3000
```

The backend also falls back to the current properties file value, but the Atlas URI in the repository should be replaced with your valid cloud connection string.

### To Change MongoDB Connection

1. Update the root `.env` file with your Atlas URI.
2. Make sure your Atlas database user and password are correct.
3. Make sure your IP address is allowed in Atlas Network Access.
4. Restart the backend.

### MongoDB Atlas Network Access

Make sure your current IP address is **whitelisted** in MongoDB Atlas:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access** → **IP Access List**
3. Click **Add IP Address** → **Allow Access from Anywhere** (or add your IP)

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint               | Description              | Request Body                    |
|--------|------------------------|--------------------------|----------------------------------|
| POST   | `/api/users/register`  | Register a new student   | `{ name, email, password, phone }` |
| POST   | `/api/auth/register`   | Register (alt endpoint)  | `{ name, email, password }`      |
| POST   | `/api/auth/login`      | Login                    | `{ email, password }`            |

### Database

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/api/db/check`    | Check MongoDB connection   |
| GET    | `/api/db/users`    | List all registered users  |

### Example: Register a User (using cURL)

```bash
curl -X POST http://localhost:8080/api/users/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John\",\"email\":\"john@test.com\",\"password\":\"Test1234\",\"phone\":\"0771234567\"}"
```

---

## 🌐 Available Pages

| Route            | Page                | Description                     |
|------------------|---------------------|---------------------------------|
| `/`              | Home (redirect)     | Redirects to `/dashboard`       |
| `/dashboard`     | Dashboard           | Landing page with hero section  |
| `/course`        | Courses             | List of all available courses   |
| `/course/:id`    | Course Details      | Single course info + enroll btn |
| `/teacher`       | Teachers            | List of all teachers            |
| `/about`         | About Us            | Mission, vision, why choose us  |
| `/contact`       | Contact Us          | Contact form + Google Maps      |
| `/login`         | Login               | Student login form              |
| `/register`      | Register            | Student registration form       |
| `/enroll/:id`    | Enroll              | Course enrollment form          |
| `/search?q=...`  | Search Results      | Search courses and teachers     |
| `/ReadMore`      | Read More           | Company details page            |

---

## 🔧 Troubleshooting

### Backend won't start

| Problem | Solution |
|---------|----------|
| `java` is not recognized | Install JDK 21+ and add to PATH |
| Port 8080 already in use | Kill the process: `netstat -ano \| findstr :8080` then `taskkill /PID <PID> /F` |
| MongoDB connection timeout | Check your internet connection and Atlas IP whitelist |
| BUILD FAILURE | Run `.\mvnw.cmd clean compile -DskipTests` to see detailed errors |

### Frontend won't start

| Problem | Solution |
|---------|----------|
| `node` is not recognized | Install Node.js 18+ and restart your terminal |
| Port 3000 already in use | Press `Y` when prompted, or kill process on port 3000 |
| Module not found errors | Run `npm install` again in the `frontend/` directory |
| Blank page | Check browser console for errors (F12) |

### Registration / Login not working

| Problem | Solution |
|---------|----------|
| Network Error | Make sure the backend is running on port 8080 |
| CORS error | Backend SecurityConfig must allow `http://localhost:3000` |
| "Email already in use" | That email is already registered, use a different one |
| Connection refused | Check MongoDB Atlas → Network Access → IP whitelist |

### Quick Health Check Commands

```bash
# Check if backend is running
curl http://localhost:8080/api/db/check

# Check if frontend is running
curl http://localhost:3000

# Check Java version
java -version

# Check Node version
node --version
```

---

## 📦 Quick Start (Copy-Paste)

Open **two terminals** and run these commands:

**Terminal 1 — Backend:**
```bash
cd C:\Users\USER\Desktop\online_education\Backend
.\mvnw.cmd clean spring-boot:run -DskipTests
```

**Terminal 2 — Frontend:**
```bash
cd C:\Users\USER\Desktop\online_education\frontend
npm install
npm start
```

Then open **http://localhost:3000** in your browser. 🎉

---

© 2026 TL-Education. All Rights Reserved.
