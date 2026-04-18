# Musicwire

Musicwire is a full-stack music web application with a Node.js/Express backend and a React + Vite frontend.

## Project Structure

- `backend/` — Node.js backend API and web server
- `frontend/` — React frontend built with Vite
- `frontend-old/` — legacy Create React App version of the frontend

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Cors, Helmet
- Frontend: React, Vite, React Router, Redux Toolkit, MUI, Axios

## Getting Started

### Backend

1. Change to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and configure your values:
   ```bash
   cp .env.example .env
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. For development with automatic restart:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Change to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or update `.env` with the API base URL:
   ```env
   VITE_BASE_API_URL=http://localhost:3000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend `.env`

The backend uses environment variables from `backend/.env`. See `backend/.env.example` for required values, including:

- `MONGODB_URI`
- `ENABLE_B2_STORAGE`
- `B2_ENDPOINT_URL`
- `B2_BUCKET_NAME`
- `B2_KEY_ID`
- `B2_APPLICATION_KEY`
- `JWT_SECRET`

### Frontend `.env`

The frontend uses Vite environment variables in `frontend/.env`:

- `VITE_BASE_API_URL`

## Scripts

### Backend

- `npm start` — start the backend server
- `npm run start:dev` — start the backend server with `nodemon`

### Frontend

- `npm run dev` — start Vite development server
- `npm run build` — build the frontend for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Notes

- The frontend expects the backend API to be available at the URL configured in `VITE_BASE_API_URL`.
- If you want to run both projects together, start the backend first and then the frontend.

## License

This project is licensed under the MIT License.
