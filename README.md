# Student Expense Tracker - Setup Guide

A comprehensive expense tracking application built specifically for Indian college students with features like PDF report generation and smart spending suggestions.

## Features

- 📊 Track expenses with categories relevant to Indian college students
- 💰 Monthly spending analytics with charts
- 📄 **Download monthly reports in PDF format**
- 💡 **Smart spending suggestions** tailored for students
- 📱 Mobile-responsive design
- 🎨 Beautiful and intuitive UI

## Categories

- Food & Snacks
- Transport
- Study Materials
- Entertainment
- Shopping
- Recharge & Internet
- Hostel/Rent
- Medical
- Grooming
- Others

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Edit `.env` file with your MongoDB URI (default is local MongoDB)

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Add Expenses**: Fill out the form with expense details
2. **View Dashboard**: See your spending analytics and charts
3. **Check Suggestions**: Get personalized tips to save money
4. **Download PDF**: Click "Download PDF Report" to get a detailed monthly report
5. **Track History**: View all your transactions in the list

## Smart Suggestions

The app provides intelligent spending suggestions based on:
- Recommended budgets for each category
- Your actual spending patterns
- Common money-saving tips for Indian college students

## Recommended Monthly Budget

For Indian college students (excluding rent): **₹7,000 - ₹8,000/month**

Category-wise recommendations:
- Food & Snacks: ₹3,000-4,000
- Transport: ₹1,000-1,500
- Entertainment: ₹800-1,000
- Study Materials: ₹500-1,000
- Recharge & Internet: ₹500-800
- Others: Variable

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- PDFKit (for PDF generation)

### Frontend
- React.js
- Chart.js (for visualizations)
- Axios (for API calls)
- CSS3 (for styling)

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/stats` - Get statistics
- `GET /api/expenses/suggestions` - Get spending suggestions
- `GET /api/expenses/report/pdf` - Download PDF report
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Contributing

Feel free to fork this project and customize it according to your needs!

## License

MIT License

---

Made with ❤️ for Indian College Students
