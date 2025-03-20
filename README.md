# FocusFlow Mini

An intelligent skill learning path generator with comprehensive task tracking capabilities.

## Overview

FocusFlow Mini helps users develop new skills by creating personalized learning paths with step-by-step guidance. The application breaks down complex skills into manageable tasks, provides timeline estimates, and tracks progress toward completion.

## Key Features

- **Intelligent Path Generation**: AI-powered breakdown of any skill into actionable learning steps
- **Comprehensive Task Organization**: Hierarchical view of learning paths with detailed step breakdowns
- **Smart Learning Suggestions**: Get personalized recommendations for next steps and projects
- **Progress Tracking**: Dashboard to visualize skill development progress
- **User Authentication**: Secure login via Google OAuth or email/password
- **Skill Management**: Import skills from LinkedIn or create custom skill profiles
- **Milestone Celebrations**: Recognize significant progress achievements

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Daisy UI component library

### Backend
- Node.js with Express.js
- Cookies for authentication and session management
- localStorage for caching
- JWT for secure API access
- arcject for rate-limiting, bot detection and request filtering

### Database
- PostgreSQL using neon serverless database (for free hosting)

### Integrations
- OpenAI/Claude API for learning path generation
- LinkedIn API for skill import
- Google OAuth for authentication

### DevOps
- Git/GitHub for version control
- Vercel/Railway for deployment
- CI/CD pipeline for automated testing and deployment

## Installation

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/focusflow-mini.git
cd focusflow-mini
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment setup:
   - Create `.env` files in both server and client directories
   - Configure the following variables:

**Server .env:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/focusflow"
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENAI_API_KEY="your-openai-api-key"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
PORT=8000
```

**Client .env:**
```
REACT_APP_API_URL="http://localhost:8000/api"
REACT_APP_GOOGLE_CLIENT_ID="your-google-client-id"
```

4. Database setup:
```bash
cd server
npx prisma migrate dev
```

5. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend server in a new terminal
cd client
npm run dev
```

## Usage

1. Register a new account or log in with Google
2. Create a new learning path by entering your skill goal
3. Customize the generated learning path as needed
4. Track your progress through the dashboard
5. Complete steps and celebrate milestones

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/me` - Get current user info

### Skills
- `GET /api/skills` - Get all user skills
- `POST /api/skills` - Create a new skill
- `POST /api/skills/import-linkedin` - Import LinkedIn skills

### Learning Paths
- `GET /api/paths` - Get all learning paths
- `POST /api/paths` - Create a new learning path
- `GET /api/paths/:id/steps` - Get all steps for a path

### Smart Features
- `GET /api/suggestions` - Get smart suggestions for user
- `POST /api/ai/generate-path` - Generate learning path steps

For a complete list of endpoints, refer to the API documentation.

## Development

### Project Structure
```
/
├── client/                   # Frontend React application
│   ├── public/               # Static files
│   └── src/
│       ├── components/       # React components
│       ├── pages/            # Page components
│       ├── hooks/            # Custom hooks
│       ├── services/         # API services
│       └── utils/            # Utility functions
│
└── server/
    ├── prisma/               # Prisma schema and migrations
    ├── src/
    │   ├── controllers/      # Route controllers
    │   ├── middleware/       # Express middleware
    │   ├── routes/           # API routes
    │   ├── services/         # Business logic
    │   └── utils/            # Utility functions
    └── tests/                # Backend tests
```

### Database Schema

The application uses a relational database with the following main entities:
- Users
- Skills
- Learning Paths
- Path Steps
- Step Details
- Smart Suggestions
- Milestones
- User Preferences

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add environment variables
4. Deploy

### Backend (Railway)
1. Connect GitHub repository
2. Configure as Web Service:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add environment variables
4. Set up PostgreSQL database instance
5. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI/Claude for AI capabilities
- shadcn UI for component library
- The entire open-source community