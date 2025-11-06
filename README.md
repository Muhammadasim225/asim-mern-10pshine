# Notes App — MERN Stack 

A full-stack **MERN Notes App** with secure authentication, robust error-handling, protected APIs ,state management using redux tolkit, and complete **SonarQube Code Quality Integration**. This project demonstrates real-world production-level architecture, clean folder structure, reusable components, and scalable backend design.

---

## Features Overview

### Authentication
- Secure JWT Access + Oauth configuration
- Hashed passwords using **bcryptjs**  
- Use Passport.js for Oauth  
- Fully protected private routes
- Use express validation
- Implement rate limiting to prevent XSS attacks

### Notes Module
- Create, Read, Update, Delete notes  
- User-specific notes protection  
- Error handling with meaningful responses  

### Frontend (React)
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

### Testing
- `__tests__` folder  
- Component testing structure ready

### SonarQube Integration (Quality Assurance)
- Local SonarQube Community Edition setup  
- Automatic source code scanning  
- Security, Reliability, Maintainability metrics  
- Quality Gate validation  
- Code Smells, Bugs, Vulnerabilities detection  

---

## Tech Stack

### Frontend
- **React.js**, **Vite**, **React Router DOM**, **Redux Toolkit**
- **CSS Modules** for modular and scoped styling

### Backend
- **Node.js**, **Express.js**
- **Authentication & Security:** JWT, Passport.js, Bcrypt.js, Helmet, Rate Limiter
- **Middleware & Utilities:** Multer, Cookie-Parser, Body-Parser, Express-Session, Dotenv, CORS
- **Logging:** Pino for structured logging

### Testing & Quality Assurance
- **Backend Testing:** Mocha & Chai  
- **Frontend Testing:** Jest  
- **Code Quality & DevOps:** SonarQube (Community Edition), ESLint

### Database
- **MySQL** with **Sequelize ORM** for relational data modeling and management

---

# Folder Structure

```
asim-mern-10pshine/
backend/
├── config/
│   ├── database.js
│   ├── multer.js
│   └── passport.js
├── controllers/
│   ├── authController.js
│   └── notesController.js
├── logs/
│   └── logging.js
├── middlewares/
│   ├── protectedRoutes.js
│   └── requestLogger.js
├── models/
│   ├── note.model.js
│   └── user.model.js
├── node_modules/
├── routes/
│   ├── authRoutes.js
│   ├── facebookAuthRoutes.js
│   ├── googleAuthRoutes.js
│   └── notesRoutes.js
├── tests/
│   ├── auth.test.js
│   ├── debug.test.js
│   ├── facebookAuth.test.js
│   ├── googleAuth.test.js
│   └── note.test.js
├── uploads/
├── .env
├── package-lock.json
├── package.json
└── server.js
frontend/
├── __mocks__/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── __tests__/
│   │   ├── AuthSuccess.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EmailSent.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Login.jsx
│   │   ├── PageNotFound.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Signup.jsx
│   ├── features/
│   │   ├── __test__/
│   │   │   └── authSlice.test.jsx
│   │   ├── authSlice.jsx
│   │   ├── notesSlice.jsx
│   │   └── Spinner.jsx
│   ├── middlewares/
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── redux/
│   │   ├── store.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
├── .gitignore
├── babel.config.cjs
├── eslint.config.js
├── index.html
├── jest.config.cjs
├── jest.setup.js
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

```
---

# Authentication Flow

- **User Registration**: Users can create an account with proper validation to ensure all required data is correct.
- **User Login**: Users log in by providing valid credentials, with input validation before authentication.
- **Password Management**:
  - Users can request a password reset via the "forget-password" endpoint.
  - Password reset is securely handled through the "reset-password" endpoint.
- **Protected Routes**: Certain routes such as logout, delete account, update profile, and fetch current user require authentication through middleware that verifies the user’s token or session.
- **Logout**: Authenticated users can securely log out from their session.
- **Profile Update**: Authenticated users can update their profile information and upload an avatar image.
- **Account Deletion**: Authenticated users can delete their account via a protected endpoint.
- **Current User Info**: Users can get their current authenticated user data through a protected route.

# API Endpoints

## Authentication Routes

The following endpoints manage user authentication, password handling, profile updates, and account operations. Protected routes require valid authentication tokens.

| Method  | Endpoint               | Description                                  |
|---------|------------------------|----------------------------------------------|
| POST    | /user/create-account   | Register a new user with input validation.   |
| POST    | /user/login-account    | Log in a user and issue an authentication token. |
| POST    | /user/forget-password  | Request a password reset link or token.      |
| POST    | /user/reset-password   | Reset password using a valid reset token.    |
| DELETE  | /user/delete-account   | Delete the authenticated user's account.     |
| POST    | /user/logout           | Log out the authenticated user securely.     |
| PUT     | /user/update-profile   | Update profile info (authentication required). |
| GET     | /user/auth/me          | Retrieve current authenticated user data.    |

---

### Notes:
- Routes marked as protected require authentication middleware to verify user identity.
- Validation is applied on registration and login to ensure data integrity.
- Password reset flow uses secure token mechanisms for safety.


## Notes Routes

These endpoints handle the creation, retrieval, updating, and deletion of user notes.  
All routes are protected and require a valid authentication token.  
Rate limiting is applied to prevent abuse when creating or editing notes.

| Method | Endpoint               | Description                                          |
|---------|------------------------|------------------------------------------------------|
| POST    | /user/create-note     | Create a new note (protected, rate limited).         |
| GET     | /user/fetch-all-notes | Retrieve all notes belonging to the authenticated user. |
| GET     | /user/get-single-note/:id | Fetch a single note by its ID (protected).          |
| PUT     | /user/edit-note/:id   | Update an existing note by ID (protected, rate limited). |
| DELETE  | /user/remove-note/:id | Delete a specific note by ID (protected).            |

---

### Notes:
- All endpoints require authentication via the `protectedRoutes` middleware.  
- Rate limiting is applied to:
  - **POST /notes/create-note:** max 50 requests per hour.  
  - **PUT /notes/edit-note/:id:** max 10 requests per 15 minutes.  
- Responses include proper status messages and error handling for unauthorized or excessive requests.

## Facebook Authentication Routes

These endpoints handle Facebook OAuth authentication using Passport.js.  
Users can log in or sign up via their Facebook account, after which a JWT token is generated and stored in an HTTP-only cookie for secure access.

| Method | Endpoint                   | Description |
|---------|----------------------------|-------------|
| GET     | /auth/facebook             | Redirects the user to Facebook for authentication. |
| GET     | /auth/facebook/callback    | Handles Facebook OAuth callback, generates a JWT, sets it as a cookie, and redirects the user to the client URL. |
| GET     | /auth/facebook/me          | Returns the currently authenticated user's Facebook profile data (protected). |

---

### Notes:
- **Authentication Strategy:** Uses Passport.js `facebook` strategy.  
- **JWT Handling:** After successful authentication, a JWT is generated with user details and stored securely in a cookie.  
- **Security:**  
  - Tokens are HTTP-only and `secure` in production.  
  - Middleware `protectedRoutes` ensures only authenticated users can access `/auth/facebook/me`.  
- **Logging:** All login attempts and errors are logged using the custom logger for monitoring and debugging.  
- **Redirects:** On success, users are redirected to `CLIENT_URL`; on failure, they are redirected to `/login?error=facebook_failed`.

## Google Authentication Routes

These endpoints handle Google OAuth 2.0 authentication using Passport.js.  
After successful login via Google, a JWT token is generated and stored as an HTTP-only cookie for secure client access.

| Method | Endpoint                | Description |
|---------|-------------------------|-------------|
| GET     | /auth/google            | Redirects the user to Google for authentication and consent. |
| GET     | /auth/google/callback   | Handles Google OAuth callback, generates a JWT, sets it as a cookie, and redirects the user to the client URL. |
| GET     | /auth/google/me         | Returns the authenticated user's Google profile data (protected). |

---

### Notes:
- **Authentication Strategy:** Uses Passport.js `google` strategy with scopes for `profile` and `email`.  
- **JWT Handling:**  
  - A JSON Web Token (JWT) is created after successful authentication.  
  - The token is stored securely in an HTTP-only cookie for 1 hour.  
- **Security:**  
  - `protectedRoutes` middleware ensures only authenticated users can access `/auth/google/me`.  
  - Cookies are `httpOnly` and `sameSite` protected.  
- **Logging:**  
  - Successful logins and errors are logged using the custom logger for audit and debugging purposes.  
- **Redirects:**  
  - On success, users are redirected to the configured `CLIENT_URL`.  
  - On failure, users are redirected to `/login?error=google_failed`.  



## SonarQube Integration

SonarQube was integrated into this project to perform continuous code quality inspection, detect code smells, maintainability issues, and security vulnerabilities.

### Setup Steps

1. **Install and Run SonarQube Locally**
   - Download and start **SonarQube Community Edition** from the official website.  
   - Access the dashboard at `http://localhost:9000`.  
   - Log in using the default credentials (`admin` / `admin`) and create a new project named **“Notes App”**.  
   - Generate a **SonarQube authentication token** for this project.

2. **Add SonarQube Configuration**
   In the project **root directory**, create a file named `sonar-project.properties` with the following (safe) configuration:

   ```properties
   sonar.projectKey=notes-app
   sonar.projectName=Notes App
   sonar.host.url=http://localhost:9000
   sonar.token=<YOUR_GENERATED_TOKEN>

   # Source folders
   sonar.sources=backend,frontend

   # Ignore build and dependency folders
   sonar.exclusions=backend/node_modules/**,frontend/node_modules/**,frontend/build/**

   # JavaScript/TypeScript Coverage
   sonar.javascript.lcov.reportPaths=coverage/lcov.info


## Environment Variables

The project uses environment variables to manage configuration and sensitive credentials.  
Create a `.env` file in the **project root directory** and define the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_NAME=<your_database_name>
DB_USERNAME=<your_database_username>
DB_PASSWORD=<your_database_password>
DB_HOST=localhost

# JWT Configuration
JWT_SECRET_KEY=<your_jwt_secret_key>

# Email Configuration
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_app_password>

# Google OAuth Credentials
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# Facebook OAuth Credentials
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>

# Client Application URL
CLIENT_URL=http://localhost:5173/
```

## How to Run the Project

Follow these steps to set up and run the full-stack **Notes App** locally.

---

### 1. Start the Backend Server

The backend is built using **Node.js (Express)**, connected to **MySQL** via **Sequelize**, and includes authentication, file uploads, and API routes.

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Start the server in development mode
npm run dev

```
## Screenshots

<img width="740" height="371" alt="first" src="https://github.com/user-attachments/assets/34dd452e-bc7e-4fd4-ab5e-8e091825cda4" />
<img width="941" height="434" alt="two" src="https://github.com/user-attachments/assets/09b82789-b022-48f3-af08-5ae01e6e6901" />
<img width="946" height="422" alt="third" src="https://github.com/user-attachments/assets/7aae4662-90b9-4da8-8105-ee6cd0392420" />
<img width="941" height="434" alt="fourth" src="https://github.com/user-attachments/assets/74b44a4a-e773-432e-b9c7-4639692179b9" />
<img width="940" height="440" alt="fifth" src="https://github.com/user-attachments/assets/7cbec57c-0573-4491-bf98-d70fd657df4c" />
<img width="664" height="438" alt="sixth" src="https://github.com/user-attachments/assets/dcc53279-4dce-430b-acf4-f26e2f7fd5e6" />

## Learning Outcomes

During this project, I gained hands-on experience in both frontend and backend development using modern tools and best practices. Some key learning outcomes include:

- **React.js & Redux Toolkit:**  
  Learned to manage complex application state efficiently using Redux Toolkit and implemented asynchronous operations with **createAsyncThunk**.

- **Backend with Express.js & Sequelize:**  
  Built RESTful APIs using **Express.js**, and integrated **MySQL** database through **Sequelize ORM** for smooth data modeling and queries.

- **Asynchronous Programming:**  
  Understood the flow of async/await, API calls, and error handling in both frontend and backend.

- **Testing:**  
  Implemented testing for both sides of the stack:  
  - **Mocha & Chai** for backend unit and integration testing.  
  - **Jest** for frontend component and logic testing.  

- **Full-Stack Integration:**  
  Connected frontend and backend seamlessly, handled API requests/responses, and maintained data consistency.

- **Project Structuring & Best Practices:**  
  Followed modular architecture, environment variable configuration, and reusable component patterns for scalability and maintainability.


## Future Enhancements

In future updates, I plan to enhance the application with the following features:

- **AI Integration:**  
  Add an AI-powered module to provide intelligent suggestions, content autocompletion, and smart recommendations.

- **Speech-to-Text Support:**  
  Implement a voice input feature allowing users to interact with the app using speech recognition.

- **Advanced Search Functionality:**  
  Introduce a robust search system to quickly find relevant content or data.

- **Tagging System:**  
  Add tags and categories for better organization and filtering of information.

- **UI/UX Improvements:**  
  Enhance the overall design, responsiveness, and accessibility for a smoother user experience.

- **Performance Optimization:**  
  Optimize API calls and database queries for faster loading and improved scalability.


## © Author

**Muhammad Asim**  
*Full Stack Developer | MERN | UI/UX | AI Integration Speciialist*  

**Connect with me:**  
- [GitHub](https://github.com/Muhammadasim225/MuhammadAsim)  
- [LinkedIn](https://www.linkedin.com/in/muhammad-asim-764a8a273/)  
- [Portfolio](https://portfolioweb-app-chi.vercel.app/)

