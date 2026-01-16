# Expency Backend - Production-Ready API

A robust, secure, and scalable backend API for the Expency expense tracking application.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.js       # Environment variables & validation
│   │   └── database.js  # Database connection
│   ├── constants/       # Application constants
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
```

## 🚀 Production Features

### Security
✅ Helmet.js security headers  
✅ Rate limiting (100 req/15min, 5 auth req/15min)  
✅ NoSQL injection protection  
✅ XSS protection  
✅ HPP protection  
✅ JWT authentication  
✅ Bcrypt password hashing  

### Validation
✅ Express Validator  
✅ Schema validation  
✅ Input sanitization  

### Performance
✅ Gzip compression  
✅ MongoDB connection pooling  
✅ Centralized error handling  
✅ Request logging (Morgan)  

## 📦 Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## 🔐 Required Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/expency
JWT_SECRET=your-super-secret-key-min-32-chars
```

## 📡 API Endpoints

**Auth:**
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get user

**Expenses (Protected):**
- GET `/api/expenses` - List expenses
- POST `/api/expenses` - Create expense
- PUT `/api/expenses/:id` - Update expense
- DELETE `/api/expenses/:id` - Delete expense
- GET `/api/expenses/stats` - Statistics
- GET `/api/expenses/suggestions` - AI suggestions
- GET `/api/expenses/report/pdf` - PDF report

## 🚀 Production Deployment

```bash
# Use PM2
pm2 start src/server.js --name expency-api
pm2 save
pm2 startup
```

## 📊 Response Format

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {}
}
```

## 🛡️ Security

- Rate limiting prevents brute force
- JWT tokens expire in 30 days
- Passwords require 6+ chars with numbers
- All inputs validated and sanitized
