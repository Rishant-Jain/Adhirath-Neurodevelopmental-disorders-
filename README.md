# Adhirath - AI-Powered Learning Pathway Recommendation System

A full-stack web application that provides personalized learning pathway recommendations for children with special needs using AI/ML technology.

## 🌟 Features

- **Intelligent Assessment**: Multi-step questionnaire to evaluate child's abilities and needs
- **AI-Powered Recommendations**: Machine learning model provides personalized learning pathways
- **User Authentication**: Secure signup/login with JWT authentication
- **Progress Tracking**: Monitor and track learning progress over time
- **Review System**: Community feedback and testimonials
- **Responsive Design**: Beautiful, modern UI built with React and Tailwind CSS

## 🏗️ Architecture

### Frontend
- **Framework**: React 19.1.0
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

### AI Service
- **Framework**: FastAPI (Python)
- **ML Model**: Random Forest Multi-label Classifier
- **Data Processing**: Pandas, NumPy
- **Model Serialization**: Joblib

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account (for production) or local MongoDB
- npm or yarn package manager

## 🚀 Deployment to Vercel

### Step 1: Prepare MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/adhirath`)

### Step 2: Deploy AI Service (Recommended: Separate Platform)

The AI service is best deployed on a platform that supports Python and larger file sizes:

**Option A: Railway**
1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select the `ai-service` directory
4. Add environment variable: `MONGODB_URI`
5. Deploy and note the URL

**Option B: Render**
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set root directory to `ai-service`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn predict_api:app --host 0.0.0.0 --port $PORT`
7. Add environment variable: `MONGODB_URI`
8. Deploy and note the URL

### Step 3: Deploy to Vercel

#### Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to project directory**
   ```bash
   cd path/to/Adhirath-main
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory (don't commit this!):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adhirath
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   REACT_APP_API_URL=https://your-app.vercel.app
   REACT_APP_AI_URL=https://your-ai-service-url.railway.app
   ```

5. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **adhirath** (or your preferred name)
   - In which directory is your code located? **./**
   
6. **Add environment variables to Vercel**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add REACT_APP_API_URL
   vercel env add REACT_APP_AI_URL
   ```
   
   Or add them via the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add each variable for Production, Preview, and Development

7. **Deploy to production**
   ```bash
   vercel --prod
   ```

#### Using GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: `cd Frontend && npm install && npm run build`
     - Output Directory: `Frontend/build`
     - Install Command: `npm install`

3. **Add Environment Variables**
   - In project settings, add all environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `REACT_APP_API_URL` (use your Vercel app URL)
     - `REACT_APP_AI_URL` (use your AI service URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Step 4: Update Frontend Environment Variables

After deployment, update the `REACT_APP_API_URL` in Vercel:
1. Go to Project Settings → Environment Variables
2. Update `REACT_APP_API_URL` to your actual Vercel deployment URL
3. Redeploy the project

## 🧪 Local Development

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Adhirath-main
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd Frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..
```

### 3. Set up environment variables

Create `.env` files in respective directories:

**Frontend/.env**
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AI_URL=http://localhost:8000
```

**Root .env** (for backend)
```env
MONGODB_URI=mongodb://localhost:27017/adhirath
JWT_SECRET=your-local-secret-key
PORT=8080
```

**ai-service/.env**
```env
MONGODB_URI=mongodb://localhost:27017/adhirath
PORT=8000
```

### 4. Start all services

```bash
# From root directory
npm start
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8080
- AI Service on http://localhost:8000

## 📁 Project Structure

```
Adhirath-main/
├── Frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── utils/        # Utility functions and contexts
│   │   ├── assets/       # Images and static files
│   │   └── App.js        # Main app component
│   └── package.json
├── backend/              # Express.js backend
│   ├── routes/          # API routes
│   ├── models/          # MongoDB models
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── ai-service/          # FastAPI AI service
│   ├── predict_api.py   # Main API file
│   ├── train_model.py   # Model training script
│   ├── rf_multilabel_model.pkl  # Trained model
│   └── label_encoders_rf/       # Feature encoders
├── vercel.json          # Vercel configuration
└── package.json         # Root package.json
```

## 🔧 Troubleshooting

### Build Fails on Vercel
- Check that all environment variables are set
- Verify MongoDB connection string is correct
- Check build logs for specific errors

### API Endpoints Not Working
- Ensure `REACT_APP_API_URL` points to your Vercel deployment
- Check CORS settings in backend
- Verify environment variables are set in Vercel

### AI Service Connection Issues
- Ensure AI service is deployed and running
- Verify `REACT_APP_AI_URL` is correct
- Check AI service logs for errors

## 📝 License

This project is part of the SURE Trust DSA in Java program.

## 👥 Contributors

- Rishant Sachin Wadewale

## 🙏 Acknowledgments

- SURE Trust for the opportunity
- All contributors and testers
