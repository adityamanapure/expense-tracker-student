# Expense Tracker Backend

Professional backend structure for the Student Expense Tracker application.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   │   └── database.js
│   ├── controllers/     # Request/response handlers
│   │   └── expenseController.js
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── models/          # Database schemas
│   │   └── Expense.js
│   ├── routes/          # API route definitions
│   │   └── expenseRoutes.js
│   ├── services/        # Business logic layer
│   │   ├── expenseService.js
│   │   ├── suggestionService.js
│   │   └── pdfService.js
│   ├── utils/           # Helper functions
│   │   └── logger.js
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── package.json
└── README.md
```

## Architecture

### Separation of Concerns

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and complex operations
- **Models**: Define database schemas and data structure
- **Routes**: Define API endpoints
- **Middleware**: Process requests before they reach controllers
- **Config**: Centralized configuration management
- **Utils**: Reusable helper functions

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with optional filters)
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/suggestions` - Get spending suggestions
- `GET /api/expenses/report/pdf` - Download PDF report
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Features

✅ Clean architecture with separation of concerns  
✅ Service layer for business logic  
✅ Error handling middleware  
✅ Request logging  
✅ PDF report generation  
✅ Smart spending suggestions  
✅ MongoDB with Mongoose ODM  
✅ RESTful API design  

## Development Best Practices

1. **Controllers** handle HTTP only - no business logic
2. **Services** contain all business logic
3. **Models** define data structure only
4. **Middleware** for cross-cutting concerns
5. **Utils** for reusable functions
6. **Config** for centralized settings
