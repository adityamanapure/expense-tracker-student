# Production Deployment Guide

## 🏭 Backend Structure Improvements

The backend has been completely restructured for production with industry best practices:

### ✅ What's New

1. **Security Hardening**
   - Helmet.js for security headers
   - Rate limiting (anti-brute force)
   - NoSQL injection protection
   - XSS protection
   - HTTP Parameter Pollution prevention
   - CORS configuration
   - JWT token security

2. **Input Validation**
   - Express-validator for all endpoints
   - Request sanitization
   - Schema validation
   - Custom validation middleware

3. **Error Handling**
   - Centralized error handler
   - Custom ApiError class
   - Standardized ApiResponse format
   - Async error wrapper
   - Proper HTTP status codes

4. **Configuration Management**
   - Environment-based config (src/config/env.js)
   - Validation of required env vars
   - Separate dev/prod settings

5. **Code Organization**
   - Validators folder for request validation
   - Utils folder for reusable code
   - Constants for app-wide values
   - Proper separation of concerns

6. **Performance**
   - Gzip compression
   - MongoDB connection pooling
   - Request logging with Morgan
   - Graceful shutdown handling

## 📁 New File Structure

```
src/
├── config/
│   ├── env.js              # ⭐ NEW - Environment config
│   └── database.js         # ✏️  Updated - Better error handling
├── constants/
│   └── index.js            # ⭐ NEW - App constants
├── controllers/
│   ├── authController.js   # ✏️  Updated - Uses ApiResponse, asyncHandler
│   └── expenseController.js # ✏️  Updated - Better error handling
├── middleware/
│   ├── auth.js             # ✏️  Updated - Better error messages
│   ├── errorHandler.js     # ✏️  Updated - Comprehensive error handling
│   ├── requestLogger.js    # ✏️  Updated - Morgan integration
│   ├── security.js         # ⭐ NEW - Security middleware
│   └── validate.js         # ⭐ NEW - Validation error handler
├── models/
│   ├── User.js
│   └── Expense.js
├── routes/
│   ├── authRoutes.js       # ✏️  Updated - Added validators
│   └── expenseRoutes.js    # ✏️  Updated - Added validators
├── services/
│   ├── expenseService.js
│   ├── suggestionService.js
│   └── pdfService.js
├── utils/
│   ├── ApiError.js         # ⭐ NEW - Custom error class
│   ├── ApiResponse.js      # ⭐ NEW - Standardized response
│   ├── asyncHandler.js     # ⭐ NEW - Async wrapper
│   └── logger.js
├── validators/
│   ├── authValidators.js   # ⭐ NEW - Auth validation rules
│   └── expenseValidators.js # ⭐ NEW - Expense validation rules
├── app.js                  # ✏️  Updated - Security middleware
└── server.js               # ✏️  Updated - Graceful shutdown
```

## 🚀 Getting Started

### 1. Install New Dependencies

```bash
cd backend
npm install
```

New packages installed:
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - NoSQL injection protection
- `hpp` - HTTP Parameter Pollution protection
- `express-validator` - Request validation
- `morgan` - Request logging
- `compression` - Gzip compression

### 2. Update Environment Variables

Copy the new `.env.example`:
```bash
cp .env.example .env
```

Required variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expency
JWT_SECRET=your-secret-key-CHANGE-THIS
JWT_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
```

### 3. Start the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## 🔒 Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes (prevent brute force)

### Input Validation
All endpoints now validate:
- Email format
- Password strength (min 6 chars, must have number)
- MongoDB ObjectID format
- Numeric ranges (month, year)
- String lengths
- Category/payment mode enums

### Error Responses
Standardized format with validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## 📊 API Changes

### Request Validation
All requests are now validated. Example errors:

**Invalid expense creation:**
```bash
POST /api/expenses
{
  "description": "Ab",  # Too short
  "amount": -10,        # Negative
  "category": "Invalid" # Not in enum
}
```

Response:
```json
{
  "success": false,
  "errors": [
    {
      "field": "description",
      "message": "Description must be between 3 and 200 characters"
    },
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    },
    {
      "field": "category",
      "message": "Invalid category"
    }
  ]
}
```

### Success Response Format
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Signup with Validation
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Rate Limiting
Try logging in more than 5 times in 15 minutes - you'll get rate limited.

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (min 32 random characters)
- [ ] Configure production MongoDB URI (MongoDB Atlas recommended)
- [ ] Set proper `CORS_ORIGIN` (your frontend domain)
- [ ] Review `RATE_LIMIT_MAX` for your traffic
- [ ] Enable HTTPS (use reverse proxy like Nginx)
- [ ] Set up monitoring (PM2, New Relic, DataDog)
- [ ] Configure backup strategy for MongoDB
- [ ] Set up logging (Winston, Loggly)
- [ ] Review security headers in production

### PM2 Deployment
```bash
npm install -g pm2

# Start application
pm2 start src/server.js --name expency-api -i max

# Save configuration
pm2 save

# Auto-restart on server reboot
pm2 startup

# Monitor
pm2 monit
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t expency-api .
docker run -p 5000:5000 --env-file .env expency-api
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📈 Monitoring & Logging

### Request Logging
All requests are logged with Morgan:
- Development: Concise colored output
- Production: Combined Apache format

### Error Tracking
Errors include:
- Stack traces (development only)
- Request details
- User information
- Timestamp

### Health Monitoring
Use `/api/health` endpoint for:
- Uptime monitoring
- Load balancer health checks
- Status page integration

## 🔧 Maintenance

### Database Backup
```bash
mongodump --uri="$MONGODB_URI" --out=/backup/$(date +%Y%m%d)
```

### View Logs
```bash
# PM2 logs
pm2 logs expency-api

# Follow logs
pm2 logs expency-api --lines 100
```

### Update Application
```bash
git pull
npm install
pm2 restart expency-api
```

## 🐛 Troubleshooting

### "Missing required environment variables"
Make sure all required env vars are set in `.env`:
- `JWT_SECRET`
- `MONGODB_URI`

### Rate limit errors
Wait 15 minutes or adjust `RATE_LIMIT_MAX` in `.env`

### Validation errors
Check the error response for specific field issues

### Database connection failed
Verify `MONGODB_URI` and ensure MongoDB is running

## 📝 Best Practices Applied

1. ✅ **Environment-based configuration**
2. ✅ **Input validation on all endpoints**
3. ✅ **Centralized error handling**
4. ✅ **Security middleware**
5. ✅ **Rate limiting**
6. ✅ **Request logging**
7. ✅ **Graceful shutdown**
8. ✅ **Separation of concerns**
9. ✅ **DRY principle**
10. ✅ **Consistent code style**

## 🎯 What's Production-Ready

- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ Logging
- ✅ Environment config
- ✅ Database connection management
- ✅ Graceful shutdown
- ✅ Compression
- ✅ CORS configuration
- ✅ API versioning ready
- ✅ Scalable architecture

Your backend is now ready for production deployment! 🚀
