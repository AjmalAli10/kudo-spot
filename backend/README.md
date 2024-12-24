# KudoSpot Backend

Express.js backend API for the KudoSpot employee engagement platform.

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create .env file:

   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_uri
   ```

3. Initialize test data:

   ```bash
   npm run init-data
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run init-data` - Initialize test data

## Tech Stack

- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 7.0.3
- CORS enabled
- dotenv for configuration

## Project Structure

```
backend/
├── config/         # Configuration files
├── models/         # MongoDB models
│   ├── User.js
│   ├── Kudos.js
│   └── Badge.js
├── routes/         # API routes
│   ├── users.js
│   ├── kudos.js
│   ├── badges.js
│   └── analytics.js
├── scripts/        # Utility scripts
│   └── initTestUsers.js
├── server.js       # Server entry point
└── .env           # Environment variables
```

## Database Schema

### Users Collection

```javascript
{
  name: String,
  kudosReceived: Number,
  kudosGiven: Number,
  createdAt: Date
}
```

### Kudos Collection

```javascript
{
  fromUser: String,
  toUser: String,
  badge: String,
  message: String,
  likes: Number,
  likedBy: [String],
  timestamp: Date
}
```

### Badges Collection

```javascript
{
  name: String,
  description: String,
  timesAwarded: Number
}
```

## API Documentation

### Authentication

Simple name-based authentication with no password required for MVP.

### Users API

- `POST /api/users/login`
  ```javascript
  // Request body
  {
    "name": "string"
  }
  ```

### Kudos API

- `GET /api/kudos?page=1&limit=10` - Get kudos feed with pagination
- `POST /api/kudos`
  ```javascript
  // Request body
  {
    "fromUser": "string",
    "toUser": "string",
    "badge": "string",
    "message": "string"
  }
  ```
- `POST /api/kudos/:id/like`
  ```javascript
  // Request body
  {
    "userName": "string"
  }
  ```

### Badges API

- `GET /api/badges` - Get all badges
- `POST /api/badges/init` - Initialize default badges

### Analytics API

- `GET /api/analytics/kudos-by-badge` - Get kudos distribution
- `GET /api/analytics/leaderboard` - Get top users
- `GET /api/analytics/most-liked` - Get most liked kudos
- `GET /api/analytics/user-stats/:userName` - Get user statistics

## Error Handling

All API endpoints follow this error response format:

```javascript
{
  "message": "Error description"
}
```

HTTP Status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## MongoDB Atlas Setup

1. Create free cluster at MongoDB Atlas
2. Create database user
3. Whitelist IP address (0.0.0.0/0 for development)
4. Get connection string
5. Replace `<password>` with your password
6. Add database name: `kudospot`

## Environment Variables

| Variable    | Description               | Default  |
| ----------- | ------------------------- | -------- |
| PORT        | Server port               | 5001     |
| MONGODB_URI | MongoDB connection string | required |

## Common Issues

1. **MongoDB Connection Failed**

   - Check MongoDB Atlas status
   - Verify connection string
   - Check IP whitelist

2. **Data Initialization Failed**

   - Ensure MongoDB connection is working
   - Check for duplicate key errors
   - Verify database permissions

3. **CORS Errors**
   - Check allowed origins in CORS configuration
   - Verify request headers

## Security Notes

- This is an MVP with minimal security
- No password authentication
- CORS enabled for all origins in development
- No rate limiting implemented

## Performance Considerations

1. Database indexes are created for:

   - User names (unique)
   - Kudos timestamp (for feed)
   - Badge names (unique)

2. Pagination implemented for:

   - Kudos feed
   - Analytics queries

3. Caching considerations:
   - Badge data rarely changes
   - User data frequently updates
   - Kudos feed requires real-time updates
