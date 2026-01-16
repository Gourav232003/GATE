# GATE Prep Pro 🎓

A comprehensive GATE exam preparation platform built with React and Node.js.

## Features

### 🧠 1. Extensive Question Bank & PYQs
- ✅ Large database of MCQs aligned with GATE syllabus
- ✅ Previous Year Questions (PYQs) with detailed solutions (10+ years)
- ✅ Topic-wise practice sets for focused revision
- ✅ Difficulty filtering (Easy, Medium, Hard)
- ✅ Bookmarking questions for later review

### 📝 2. Mock Tests & Performance Analytics
- ✅ Full-length mock tests simulating real GATE exam format
- ✅ Timed practice with automatic submission
- ✅ Performance tracking dashboards
- ✅ Detailed analysis with correct/incorrect breakdown
- ✅ Subject-wise and topic-wise accuracy tracking
- ✅ Weekly progress charts

### 📚 3. Revision Notes & Syllabus Coverage
- ✅ Chapter-wise revision notes for all core subjects
- ✅ Formula sheets and quick revision materials
- ✅ Complete GATE CS 2026 syllabus with progress tracking
- ✅ Important topics overview

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Demo Credentials
- **Email**: demo@gateprep.com
- **Password**: demo123

## Project Structure

```
gate-prep-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── seed.js            # Database seeder
│   └── database.sqlite    # SQLite database
└── package.json
```

## Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run client` - Start frontend only
- `npm run server` - Start backend only
- `npm run seed` - Seed database with sample data
- `npm run build` - Build frontend for production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics

### Questions
- `GET /api/questions/:subject/:topic` - Get questions by subject/topic
- `POST /api/questions/attempt` - Submit question attempt

### Tests
- `GET /api/tests` - Get all available tests
- `GET /api/tests/:id/questions` - Get test questions
- `POST /api/tests/:id/submit` - Submit test results

### Analytics
- `GET /api/analytics` - Get user analytics

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks/:questionId` - Add bookmark
- `DELETE /api/bookmarks/:questionId` - Remove bookmark

## License

MIT License - Feel free to use this for your GATE preparation!

---

**Good luck with your GATE preparation! 🚀**
# GATE
