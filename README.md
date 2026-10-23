# AcadBoost — Academic Management System

AcadBoost is an academic management platform designed to streamline academic administration, faculty workflows, student attendance, and timetable management. Its backend provides REST APIs for managing academic data, tracking attendance, generating institutional analytics, and integrating an AI-powered chatbot.

## Features

### Authentication and User Management
- User registration, login, and logout.
- JWT-based authentication using HTTP-only cookie workflows.
- Password hashing with bcrypt.
- Role-based user profiles for students, faculty, and administrators.
- Redis-backed token blocking for logout and session invalidation.

### Admin Dashboard
- Create and manage departments, courses, and rooms.
- Generate and publish department timetables.
- Check timetable conflicts.
- Retrieve faculty assignments and department information.
- Analyze student counts by department and academic year.
- Generate attendance analytics by department and course.
- Export student statistics as PDF reports.

### Faculty Portal
- View assigned courses and faculty schedules.
- Retrieve students enrolled in a course.
- Start attendance sessions and record attendance.
- Access attendance summaries and previous attendance reports.

### Student Portal
- View department timetables and personal attendance records.
- Mark attendance through a QR-based workflow with device verification.
- Interact with an AI chatbot powered by Google's Gemini API.

### Notifications
- Store web push notification subscriptions.
- Expose the public VAPID key for push notification setup.
- Send push notifications to saved subscriptions.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API and routing |
| MongoDB | Persistent data storage |
| Mongoose | Database models and queries |
| Redis | Token invalidation and caching infrastructure |
| JWT | Authentication |
| bcrypt | Password hashing |
| Google Gemini API | AI chatbot |
| PDFKit | PDF report generation |
| XLSX | Spreadsheet data processing |
| Web Push | Browser push notifications |

Additional packages include `cors`, `cookie-parser`, `dotenv`, and `validator`.

## Project Structure

```text
Backend/
├── controller/
│   ├── adminanalysiscontrol.js
│   ├── admincreatecontrol.js
│   ├── adminstudentpdf.js
│   ├── authcontrol.js
│   ├── chatbot.js
│   ├── facultycontroller.js
│   └── studentcontroller.js
├── database/
│   ├── maindb.js
│   └── redis.js
├── middleware/
│   ├── authmidware.js
│   └── verifydevicemidware.js
├── models/
│   ├── attendance.js
│   ├── courses.js
│   ├── department.js
│   ├── PushSubscription.js
│   ├── room.js
│   └── user.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── facultyroutes.js
│   ├── notificationRoutes.js
│   └── studentRoutes.js
├── utils/
│   ├── cookie.js
│   ├── pushService.js
│   └── validate.js
├── .gitignore
├── index.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- A Redis instance
- A Google Gemini API key for chatbot functionality

### 1. Clone the repository

```bash
git clone https://github.com/deBurglar/AcadBoost.git
cd AcadBoost
```

Navigate to the backend directory. Adjust the path according to the repository's actual directory structure.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```env
PORT=3000
DATABASE_STRING=your_mongodb_connection_string
JWTKEY=your_strong_jwt_secret
GEMINI_API=your_gemini_api_key

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASS=your_redis_password

VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

Configure the Redis client in `database/redis.js` to read these environment variables before running the application. Keep `.env` out of version control and never expose secret values in logs or source files.

Push notification credentials are needed only if the corresponding notification functionality is configured.

### 4. Start the server

```bash
node index.js
```

The server connects to MongoDB and Redis before starting the Express application. Ensure both services are available and the environment variables are configured correctly.

The frontend's permitted origin is currently configured as `http://localhost:5173`. Update the CORS configuration when deploying the frontend to another origin.

## API Overview

The backend organizes its endpoints into five main route groups.

| Base path | Purpose |
|---|---|
| `/auth` | Registration, login, logout, and session verification |
| `/admin` | Academic resource management, timetables, analytics, and PDF export |
| `/faculty` | Faculty courses, schedules, and attendance management |
| `/student` | Student routines, attendance, and AI chatbot |
| `/notifications` | Push subscription management and notifications |

Examples of implemented endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/check`
- `POST /admin/createcourse`
- `POST /admin/createdepartment`
- `GET /admin/getdepartments`
- `GET /faculty/schedule`
- `GET /faculty/mycourses`
- `GET /student/routine`
- `GET /student/myattendance`
- `POST /student/chat`
- `GET /notifications/publicKey`

Most admin and faculty endpoints require authentication. Student attendance marking uses a separate device-verification middleware.

Refer to the route files for the complete endpoint list, HTTP methods, parameters, and middleware requirements.

## Database Models

The backend defines Mongoose models for:

- **User:** Account information, roles, and student or faculty profiles.
- **Course:** Course names, subject codes, departments, faculty assignments, and academic year.
- **Department:** Department information and timetable entries.
- **Room:** Room names, types, capacity, and building information.
- **Attendance:** Student, course, attendance session, and timestamp records.
- **PushSubscription:** Browser push subscription data.

## Security Considerations

- Keep API keys, database credentials, Redis credentials, and JWT secrets in environment variables.
- Hash passwords before storing them.
- Use HTTPS in production.
- Configure CORS for trusted frontend origins.
- Apply role-specific authorization checks to sensitive admin and faculty operations.
- Validate and sanitize incoming requests.
- Protect device-verification and attendance workflows against unauthorized requests.

## Future Enhancements

Potential improvements include:

- Automated testing for routes and business logic.
- More granular role-based authorization.
- Improved attendance anomaly detection and reporting.
- Enhanced timetable optimization and conflict resolution.
- More detailed analytics and export options.
- Centralized error handling and API documentation.

## Author

**Anubhav Raj**

GitHub: [@deBurglar](https://github.com/deBurglar)

## License

Specify the project's license before distributing it publicly.
