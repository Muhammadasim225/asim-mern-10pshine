# Notes App — MERN Stack (Authentication, CRUD, Redux Toolkit, Mocha Chai, Jest, SonarQube Integration)

A full-stack **MERN Notes App** with secure authentication, robust error-handling, protected APIs ,state management using redux tolkit, and complete **SonarQube Code Quality Integration**. This project demonstrates real-world production-level architecture, clean folder structure, reusable components, and scalable backend design.

---

## 🚀 Features Overview

### ✅ Authentication
- Secure **JWT Access + Oauth configuration
- Hashed passwords using **bcryptjs**  
- Use Passport.js for Oauth  
- Fully protected private routes
- Use express validation
- Implement rate limiting to prevent XSS attacks

### ✅ Notes Module
- Create, Read, Update, Delete notes  
- User-specific notes protection  
- Error handling with meaningful responses  

### ✅ Frontend (React)
- React + Vite setup  
- React Router DOM for navigation  
- Complete Auth Flow (Login, Register, Forgot Password, Reset Password, EmailSent screen)  
- Reusable components
- Headless UI for Dialog or Models
- Use tiptap framework for customizable rich-text editor
- Clean UI  
- Loading & error states
- Implement redux async thunk for state management in overall project
- Use tailwindcss for styling and responsiveness

### ✅ Testing
- `__tests__` folder  
- Component testing structure ready

### ✅ SonarQube Integration (Quality Assurance)
- Local SonarQube Community Edition setup  
- Automatic source code scanning  
- Security, Reliability, Maintainability metrics  
- Quality Gate validation  
- Code Smells, Bugs, Vulnerabilities detection  

---

# 🏗️ Tech Stack

**Frontend:** React, Vite, React Router DOM, Redux Toolkit, CSS Modules  
**Backend:** Node.js, Express.js, JWT, rate-limiter, sequelize ORM, dotenv, cors, passport, bcryptjs, pino, cookie-parser, body-parser, helmet , multer, express-session etc
**DevOps / QA:** SonarQube Community Edition, SonarScanner, ESLint

---

# 📁 Folder Structure

asim/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ ├── utils/
│ ├── server.js
| ├── logs/
| ├── logging.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── tests/
│ │ │ ├── Login.jsx
│ │ │ ├── ForgotPassword.jsx
│ │ │ ├── ResetPassword.jsx
│ │ │ ├── EmailSent.jsx
│ │ ├── features/
│ │ │ ├── tests/authSlice.test.jsx
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── public/
│ └── package.json
├── sonar-project.properties
├── README.md
└── package.json

yaml
Copy code

---

# 🔐 Authentication Flow

- Auto logout when refresh token expires  
- Secure password hashing with bcrypt


# 🧪 API Endpoints
## Auth Routes

Method	Endpoint	Description
POST	/api/auth/register	Create new user
POST	/api/auth/login	Login user
POST	/api/auth/refresh	Generate new access token
POST	/api/auth/logout	Logout user

Notes Routes

Method	Endpoint	Description
GET	/api/notes	Get all user notes
POST	/api/notes	Create a new note
PUT	/api/notes/:id	Update note
DELETE	/api/notes/:id	Remove note

All Notes routes are protected via JWT.

🔥 SonarQube Integration
Analyzes:

Bugs

Code Smells

Vulnerabilities

Maintainability

Duplications

Code Reliability

Test Coverage

Install Sonar Scanner:

bash
Copy code
npm install -g @sonar/scan
Run SonarQube Server:

bash
Copy code
./bin/windows-x86-64/StartSonar.bat
Run Project Scan:

bash
Copy code
sonar-scanner \
  -Dsonar.projectKey=notes-app \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
Sonar Dashboard Outputs:

A-grade Security

Maintainability score

Reliability score

Duplications report

Hotspot review

Quality Gate status

⚙️ Environment Variables (Backend)
Create .env:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_url
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
▶️ How to Run the Project
Start Backend:

bash
Copy code
cd backend
npm install
npm run dev
Start Frontend:

bash
Copy code
cd frontend
npm install
npm run dev
✅ Screenshots
Add screenshots for:

Login

Notes Page

SonarQube Dashboard

Quality Gate status

🧠 Learning Outcomes
Secure MERN authentication

Redis session management

Vite-based frontend architecture

SonarQube integration

Code quality assurance

Proper folder structuring

Professional project documentation

🎯 Future Enhancements
Add User Profile Page

Add Collaborative Notes

Add Cloud Deployment

Add UT & Integration Tests

Add Docker support

© Author
👨‍💻 Muhammad Asim
Full Stack Developer | MERN | UI/UX | Generative AI
GitHub • LinkedIn • Portfolio
