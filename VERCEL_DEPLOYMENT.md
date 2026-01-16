# 🚀 Vercel Deployment Guide

## Frontend Deployment on Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api` (we'll get this after deploying backend)

6. Click **Deploy**

### Step 3: Deploy Backend (Choose One Option)

#### Option A: Render.com (Recommended - Free)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: expency-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://Expense-Tracker:aditya22@cluster0.okpfn83.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=jnskdnfkankwekkrpkdfnkseorkwkfm
   CORS_ORIGIN=https://your-frontend-vercel-app.vercel.app
   ```

6. Click **"Create Web Service"**
7. Copy the deployed URL (e.g., `https://expency-backend.onrender.com`)

#### Option B: Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory**: `/backend`
   - Add all environment variables (same as above)
5. Deploy and copy the URL

#### Option C: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create expency-backend`
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=jnskdnfkankwekkrpkdfnkseorkwkfm
   heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app
   ```
5. Create `Procfile` in backend folder:
   ```
   web: node src/server.js
   ```
6. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Step 4: Update Frontend Environment Variable

1. Go back to Vercel project settings
2. Go to **Settings** → **Environment Variables**
3. Edit `REACT_APP_API_URL`:
   - Value: Your backend URL + `/api` (e.g., `https://expency-backend.onrender.com/api`)
4. Click **Save**
5. Go to **Deployments** tab
6. Click **"..."** on latest deployment → **"Redeploy"**

### Step 5: Update Backend CORS

1. Update your backend environment variables:
   - `CORS_ORIGIN`: Your Vercel frontend URL (e.g., `https://expency.vercel.app`)
2. Redeploy backend if needed

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in backend matches your Vercel frontend URL exactly
- Don't include trailing slash
- Redeploy backend after changing CORS_ORIGIN

### API Not Found (404)
- Check `REACT_APP_API_URL` includes `/api` at the end
- Verify backend is running and accessible
- Check backend logs for errors

### Build Fails on Vercel
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify root directory is set to `frontend`

### Authentication Not Working
- Clear localStorage in browser
- Check JWT_SECRET is set on backend
- Verify MongoDB connection is working

## Quick Test

Once deployed, test these URLs:

**Backend Health Check**:
```
https://your-backend-url.com/api/health
```
Should return: `{"success":true,"message":"Server is running"}`

**Frontend**:
```
https://your-frontend.vercel.app
```

## Environment Variables Summary

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Render/Railway/Heroku)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=jnskdnfkankwekkrpkdfnkseorkwkfm
CORS_ORIGIN=https://your-frontend.vercel.app
```

## Post-Deployment Checklist

- [ ] Backend health endpoint accessible
- [ ] Frontend loads without errors
- [ ] User signup works
- [ ] User login works
- [ ] Can add expenses
- [ ] Can view dashboard
- [ ] Can edit/delete expenses
- [ ] PDF download works
- [ ] Suggestions load correctly
- [ ] Custom budget works

## URLs to Remember

Replace these with your actual URLs:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **MongoDB**: Already configured in .env
- **Health Check**: https://your-backend.onrender.com/api/health

---

**Need Help?** Check the deployment logs for specific error messages.
