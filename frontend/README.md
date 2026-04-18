# Musicwire Frontend

A modern React-based music streaming web application built with Vite, featuring a sleek Material-UI interface and comprehensive playlist management.

## Features

- **User Authentication**: Secure login and session management
- **Music Library**: Browse and search through songs
- **Playlists**: Create, manage, and share custom playlists
- **Favorites**: Save and organize favorite songs
- **Audio Player**: Full-featured music player with controls
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Dynamic content loading and updates

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Material-UI components with custom themes

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd musicwire/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Player/         # Audio player component
│   ├── UI/            # Generic UI elements (Modal, etc.)
│   ├── CardView/      # Card-based display components
│   ├── ListView/      # List-based display components
│   └── ...            # Other feature components
├── store/             # Redux store configuration
│   ├── auth.js        # Authentication state
│   ├── asset.js       # Music assets state
│   ├── player.js      # Player state
│   └── index.js       # Store setup
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Key Components

- **App.jsx**: Main application with routing and layout
- **Login**: User authentication interface
- **Home**: Dashboard with featured content
- **Search**: Music search functionality
- **Playlists**: Playlist management
- **Player**: Audio playback controls
- **Sidebar**: Navigation menu

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BASE_API_URL=http://localhost:3000/api
```

## API Integration

The frontend communicates with a backend API for:
- User authentication
- Music data retrieval
- Playlist management
- File uploads

## Development

### Code Style
- Uses ESLint for code linting
- Follows React best practices
- Material-UI design system

### State Management
- Redux Toolkit for predictable state updates
- Separate slices for auth, assets, and player state

### Routing
- React Router for client-side navigation
- Protected routes for authenticated users

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
