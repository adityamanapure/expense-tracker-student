# Expency - Setup and Migration Guide

## What Changed?

Your Expense Tracker has been transformed into **Expency** - a secure, account-based expense tracking application!

### New Features:
1. ✅ **User Authentication** - Signup/Login system with JWT tokens
2. ✅ **Personal Accounts** - Each user has their own private expense data
3. ✅ **Secure API** - All expense endpoints are now protected
4. ✅ **Modern UI** - Beautiful login and signup pages
5. ✅ **App Rebranding** - Changed name to "Expency"

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install new dependencies (already done)
# bcryptjs and jsonwebtoken are now installed

# Create/Update .env file
# Copy from .env.example and update values
```

**Important**: Add `JWT_SECRET` to your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/expency
PORT=5000
JWT_SECRET=your-very-secure-random-string-here
```

### 2. Database Migration

**IMPORTANT**: Existing expenses in your database won't have a `user` field. You have two options:

#### Option A: Fresh Start (Recommended for development)
```bash
# Drop the existing database and start fresh
mongosh
use expency
db.dropDatabase()
exit
```

#### Option B: Migrate Existing Data
If you want to keep existing expenses, you'll need to assign them to a user:
1. First, create a user account through the signup page
2. Get the user ID from MongoDB
3. Update all existing expenses with that user ID:
```javascript
// In mongosh:
use expency
const userId = ObjectId("paste-user-id-here")
db.expenses.updateMany({}, { $set: { user: userId } })
```

### 3. Start the Application

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 4. First Use

1. Open http://localhost:3000
2. You'll see the **Signup** page
3. Create an account with:
   - Full Name
   - Email
   - Password (min 6 characters)
4. After signup, you'll be automatically logged in
5. Start tracking your expenses!

## New File Structure

### Backend:
```
backend/src/
├── models/
│   ├── Expense.js (updated with user reference)
│   └── User.js (NEW - user model)
├── controllers/
│   ├── authController.js (NEW - signup/login/me)
│   └── expenseController.js (updated with auth)
├── routes/
│   ├── authRoutes.js (NEW - /api/auth/*)
│   └── expenseRoutes.js (updated with auth middleware)
├── middleware/
│   └── auth.js (NEW - JWT protection)
└── services/ (all updated to filter by user)
```

### Frontend:
```
frontend/src/
├── components/
│   ├── Login.js (NEW)
│   ├── Login.css (NEW)
│   ├── Signup.js (NEW)
│   ├── Signup.css (NEW)
│   └── Dashboard.js (existing - shown after login)
├── context/
│   └── AuthContext.js (NEW - manages auth state)
├── services/
│   ├── authService.js (NEW - auth API calls)
│   └── expenseService.js (updated with auth headers)
└── App.js (completely rewritten for auth)
```

## API Changes

### New Endpoints:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Updated Endpoints:
All `/api/expenses/*` endpoints now require authentication:
- Header: `Authorization: Bearer <token>`
- Token is automatically included from localStorage

## Testing Authentication

### Signup Test:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login Test:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Protected Endpoint Test:
```bash
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer <your-token-from-login>"
```

## Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
2. **JWT Tokens**: 30-day expiration, includes user ID
3. **Protected Routes**: All expense operations require valid token
4. **User Isolation**: Users can only see/modify their own expenses

## Troubleshooting

### "Not authorized, no token" error:
- Make sure you're logged in
- Check localStorage for 'user' item with token
- Token might have expired (30 days)

### Expenses not showing after login:
- You need to create new expenses after logging in
- Old expenses need to be migrated (see Database Migration above)

### Backend connection errors:
- Ensure MongoDB is running
- Check .env file has correct MONGODB_URI
- Verify JWT_SECRET is set in .env

## Next Steps

1. ✅ Test signup/login flow
2. ✅ Create some expenses
3. ✅ Test PDF export
4. ✅ Try suggestions feature
5. Consider adding:
   - Password reset functionality
   - Email verification
   - Profile management
   - Expense sharing between users

## Notes

- The app name is now **Expency** everywhere
- User sessions persist in localStorage
- Logout clears the token
- Each user's data is completely isolated
- All existing Dashboard/ExpenseList/ExpenseForm components work as before

Enjoy your new secure expense tracker! 🚀
