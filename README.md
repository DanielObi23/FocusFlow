# FocusFlow

An intelligent skill learning path generator.

## Overview

FocusFlow helps users develop new skills by creating personalized learning paths with step-by-step guidance. The application breaks down complex skills into manageable tasks qnd lets users record their skills and work experience

## Key Features

- **Intelligent Path Generation**: AI-powered personalized breakdown of any skill into actionable learning steps
- **Skill record**: Section to manage your list of skills
- **User Authentication**: Secure login via JWT tokens email/password
- **Work experience record**: Section to manage your work history

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Daisy UI component library
- TanStack query v5 for state management and client-side caching

### Backend
- Node.js with Express.js
- Cookies for authentication and session management
- localStorage for caching
- JWT for secure API access
- arcject for rate-limiting, bot detection and request filtering
- AWS S3 for profile image storage

### Database
- PostgreSQL using neon serverless database (for free hosting)

### Integrations
- Claude API for learning path generation

### DevOps
- Git/GitHub for version control
- Vercel/Railway for deployment

## Installation

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FocusFlow.git
cd FocusFlow
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment setup:
   - Create `.env` files in both server and client directories
   - Configure the following variables:

**Backend .env:**
```
PORT="your desired port"
DATABASE_URL="noen database url"

ARCJET_KEY="arcjet key"

ACCESS_TOKEN_SECRET="access token secret"
REFRESH_TOKEN_SECRET="refresh token secret"

TWILIO_ACCESS_CODE="code"
SENDGRID_API_KEY="your sendgrid api key"
SENDGRID_EMAIL="your sendgrid email"
MY_EMAIL="your email"

AWS_ACCESS_KEY="access key"
AWS_SECRET_ACCESS_KEY="secret access key"
AWS_REGION="your region"
AWS_BUCKET_NAME="your bucket name"

ANTHROPIC_API_KEY="your claude api key"
```

4. Start the development servers:
```bash
# Start backend server
cd backend
nodemon server.js

# Start frontend server in a new terminal
cd frontend
npm run dev
```

## Usage

1. Register a new account
2. Set up your profile
3. Add current skills in skills page
4. Generate learning paths for the desired skill
5. Complete steps, after path completion, the skill will automatically be added to your skill list

## Development

### Database Schema and api endpoints
```
/
├── backend/                   
│   ├── config/
|   |     ├── db.js/        # neon database
│   |     └── dbInit.js/    # database schema
│   ├── controllers/
│   ├── lib/       
│   ├── middleware/
|   ├── node_modules/       
│   ├── routes/            # API routes
│
```

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

- Claude for AI capabilities
- Daisy UI for component library
