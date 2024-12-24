# KudoSpot Frontend

React-based frontend for the KudoSpot employee engagement platform.

## Setup Instructions

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development server:

   ```bash
   pnpm run dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Tech Stack

- React.js 18.3.1
- Vite 6.0.5
- Material-UI 6.3.0
- React Query 3.39.3
- React Router DOM 7.1.1
- Chart.js 4.4.7
- Axios for API calls

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Layout.jsx     # Main layout with navigation
│   │   └── ProtectedRoute.jsx
│   ├── pages/         # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── GiveKudos.jsx
│   │   └── Analytics.jsx
│   ├── services/      # API services
│   │   └── api.js
│   ├── context/       # React context
│   │   └── UserContext.jsx
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
```

## Features

- Modern, responsive UI with Material-UI
- Real-time data fetching with React Query
- Protected routes for authenticated users
- Interactive analytics dashboard with Chart.js
- Form validation and error handling
- Optimized performance with memoization

## Environment Variables

No environment variables needed for frontend as API URL is configured in `src/services/api.js`

## Component Documentation

### Layout Component

- Main layout with navigation bar
- Handles user authentication state
- Provides navigation between pages

### Protected Route

- Protects routes from unauthorized access
- Redirects to login if not authenticated

### Pages

1. **Login**

   - Simple name-based authentication
   - Redirects to dashboard on success

2. **Dashboard**

   - Displays kudos feed with pagination
   - Like functionality for kudos
   - Real-time updates

3. **Give Kudos**

   - Form to give kudos to other users
   - Badge selection
   - Message input
   - Optimized with memoization

4. **Analytics**
   - Chart.js visualizations
   - Leaderboard display
   - Most liked kudos
   - Badge distribution stats

## State Management

- React Query for server state
- Context API for authentication state
- Local state for forms and UI

## API Integration

All API calls are centralized in `src/services/api.js` using Axios with:

- Error handling
- Response interceptors
- Request/response logging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

1. Memoized components to prevent unnecessary renders
2. React Query caching for API calls
3. Lazy loading for routes
4. Optimized bundle size

## Common Issues

1. **Blank Page**

   - Ensure backend server is running
   - Check console for errors
   - Verify API URL in api.js

2. **Login Issues**

   - Ensure backend is initialized with test data
   - Check network tab for API errors

3. **Chart Not Rendering**
   - Check if data is available
   - Verify Chart.js installation
