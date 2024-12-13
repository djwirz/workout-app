# Workout App

A **React + TypeScript + Vite** progressive web application (PWA) for tracking and managing workouts, designed for **offline-first** functionality with manual data syncing.

## Features

- **Offline-first** with IndexedDB for local storage.
- **Manual sync** of workouts, exercises, and entries.
- **Workout templates** for easy session planning.
- **Video caching** for exercise demonstrations.
- **React Query** for data fetching and caching.
- **Tailwind CSS** for styling.
- **PWA support** for installation on mobile and desktop.

## Installation

### Prerequisites

- **Node.js** (latest LTS recommended)
- **npm** (bundled with Node.js)
- **Vite** (installed as a dev dependency)

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/djwirz-workout-app.git
   cd djwirz-workout-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and set the API URL:
   ```sh
   VITE_API_URL=http://your-api-endpoint
   ```

## Usage

### Development

Start the local development server:

```sh
npm run dev
```

### Build

Generate a production build:

```sh
npm run build
```

### Lint

Check for linting errors:

```sh
npm run lint
```

### Preview

Preview the production build locally:

```sh
npm run preview
```

### Manual Syncing

Manually trigger a sync with the API:

```sh
npm run sync
```

## Project Structure

```
djwirz-workout-app/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # App pages (Planned, Ongoing, Completed, etc.)
│   ├── utils/              # Utility functions and IndexedDB handlers
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   ├── index.css           # Global styles
│   ├── env.d.ts            # Type definitions for environment variables
│   └── vite-env.d.ts       # Vite environment definitions
├── .gitignore              # Git ignore rules
├── package.json            # Project metadata and dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # TypeScript config for app
├── tsconfig.node.json      # TypeScript config for Node scripts
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## API Endpoints

The app syncs with an API defined in `VITE_API_URL`. Expected endpoints:

- `POST /sync` - Triggers a full sync
- `GET /exercises` - Fetches available exercises
- `GET /workouts` - Fetches planned workouts
- `GET /workout/:id/entries` - Fetches workout details
- `GET /video/:id` - Fetches exercise video

## Development Notes

- Uses **IndexedDB** via `localforage` for offline data storage.
- Uses **React Query** for state management and API requests.
- PWA support via **vite-plugin-pwa**.
- Bottom navigation bar provides quick access to **Ongoing Workouts** and **Exercises**.

## License

MIT License © 2025 Daniel Wirz
