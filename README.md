# JobFinder

JobFinder is a full-stack job search and posting platform built with Next.js (frontend) and Node.js/Express (backend). It allows users to find jobs, post new job listings, and manage their applications.

## Features
- Job search and filtering
- Job posting and management
- User authentication and profile management
- Responsive UI with Tailwind CSS
- RESTful API backend

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Other:** Context API, custom hooks, reusable UI components

## Project Structure
```
client/         # Frontend (Next.js)
  Components/   # Reusable React components
  app/          # Next.js app routes
  context/      # React Contexts
  lib/          # Utility functions
  providers/    # Context Providers
  public/       # Static assets
  types/        # TypeScript types
  utils/        # Utility scripts
server/         # Backend (Node.js/Express)
  controllers/  # Route controllers
  db/           # Database connection
  middleware/   # Express middleware
  models/       # Mongoose models
  routes/       # API routes
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Muskanyadav22/jobfinder-main.git
   cd jobfinder-main
   ```
2. **Install dependencies:**
   - Frontend:
     ```sh
     cd client
     npm install
     ```
   - Backend:
     ```sh
     cd ../server
     npm install
     ```
3. **Configure environment variables:**
   - Create a `.env` file in `server/` with your MongoDB URI and any other secrets.

### Running the App
- **Start the backend server:**
  ```sh
  cd server
  npm start
  ```
- **Start the frontend (Next.js) app:**
  ```sh
  cd client
  npm run dev
  ```
- Visit `http://localhost:3000` in your browser.

## Folder Details
- `client/Components/`: UI components (Header, Footer, JobCard, etc.)
- `client/app/`: Next.js pages and routes
- `client/context/`: Global and jobs context
- `server/controllers/`: Logic for jobs and users
- `server/models/`: Mongoose schemas for jobs and users
- `server/routes/`: API endpoints

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.