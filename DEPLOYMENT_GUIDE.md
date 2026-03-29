# JobFinder - Deployment Guide

## Quick Start for Local Development

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Git

### Setup Instructions

#### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/jobfinder.git
cd jobfinder
```

#### 2. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
npm install
npm start
```

Server will run on `http://localhost:5000`

#### 3. Client Setup
```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

Client will run on `http://localhost:3000`

## Production Deployment

### Environment Variables Required

**Server (.env):**
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - Strong random string (32+ characters)
- `CLIENT_URL` - Frontend URL in production
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to "production"

**Client (.env.production.local):**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_APP_URL` - Frontend application URL

### Deploy on Render

**For Backend:**
1. Create Web Service on Render
2. Connect GitHub repository
3. Set Root Directory to `server`
4. Add environment variables from `.env.example`
5. Build Command: `npm install`
6. Start Command: `npm start`

**For Frontend:**
1. Create Static Site on Render
2. Connect GitHub repository
3. Set Root Directory to `client`
4. Add environment variables
5. Build Command: `npm run build`
6. Publish Directory: `.next`

### Deploy on Vercel (Frontend)

1. Import project on vercel.com
2. Select `client` directory
3. Add environment variables
4. Deploy automatically on push

### Database Setup

1. Create MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Create database user
3. Get connection string
4. Whitelist your IP
5. Add to environment variables

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Whitelist MongoDB IP
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs from production code
- [ ] Use secure cookie settings

## Testing Before Push

```bash
# Build frontend
cd client
npm run build

# Test server
cd server
npm start
```

## Troubleshooting

**MongoDB Connection Error:**
- Verify connection string format
- Check IP whitelist on MongoDB Atlas
- Ensure database credentials are correct

**CORS Error:**
- Verify CLIENT_URL matches frontend domain
- Check API_BASE_URL in client configuration

**Build Failures:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

## Next Steps

1. Set up monitoring (Sentry, LogRocket)
2. Configure automated backups
3. Set up CI/CD pipeline
4. Monitor performance metrics
5. Plan security updates

For more detailed information, see individual README files in `client/` and `server/` directories.
