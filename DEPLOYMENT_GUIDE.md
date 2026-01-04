# Vercel Deployment Guide for Adhirath

## Prerequisites Completed ✅
- [x] All code updated with environment variables
- [x] vercel.json configuration created
- [x] .env.example files created
- [x] README.md updated with instructions
- [x] Changes committed to Git
- [x] Vercel CLI installed

## Next Steps for Deployment

### 1. Login to Vercel
Run the following command and follow the browser authentication:
```bash
vercel login
```

### 2. Deploy to Vercel
```bash
cd c:\Users\RISHANT\OneDrive\Desktop\Adhirath-main
vercel
```

When prompted:
- **Set up and deploy?** → Y
- **Which scope?** → Select your account
- **Link to existing project?** → N (unless you have one)
- **Project name?** → adhirath (or your preferred name)
- **In which directory is your code located?** → ./

### 3. Configure Environment Variables

After initial deployment, add environment variables via Vercel dashboard or CLI:

```bash
# MongoDB Connection (REQUIRED)
vercel env add MONGODB_URI production

# JWT Secret (REQUIRED)
vercel env add JWT_SECRET production

# Frontend API URL (will be your Vercel URL)
vercel env add REACT_APP_API_URL production

# AI Service URL (deploy AI service first)
vercel env add REACT_APP_AI_URL production
```

**Important Values:**
- `MONGODB_URI`: Get from MongoDB Atlas (format: `mongodb+srv://username:password@cluster.mongodb.net/adhirath`)
- `JWT_SECRET`: Generate a secure random string (min 32 characters)
- `REACT_APP_API_URL`: Your Vercel deployment URL (e.g., `https://adhirath.vercel.app`)
- `REACT_APP_AI_URL`: Your AI service URL (deploy separately on Railway/Render)

### 4. Deploy AI Service Separately

**Recommended: Railway.app**

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repository
5. Configure:
   - Root Directory: `ai-service`
   - Start Command: `uvicorn predict_api:app --host 0.0.0.0 --port $PORT`
6. Add environment variable:
   - `MONGODB_URI`: Same as above
7. Deploy and copy the URL

**Alternative: Render.com**

1. Go to https://render.com
2. New → Web Service
3. Connect repository
4. Configure:
   - Root Directory: `ai-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn predict_api:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `MONGODB_URI`
6. Deploy and copy the URL

### 5. Update Environment Variables

After deploying AI service, update Vercel environment variables:
```bash
vercel env add REACT_APP_AI_URL production
# Enter your AI service URL when prompted
```

### 6. Redeploy with Environment Variables
```bash
vercel --prod
```

### 7. MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Database Access → Add Database User
   - Username: adhirath_user
   - Password: (generate secure password)
4. Network Access → Add IP Address
   - Allow access from anywhere: 0.0.0.0/0
5. Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `adhirath`

### 8. Verify Deployment

After deployment, test:
- [ ] Homepage loads
- [ ] User signup works
- [ ] User login works
- [ ] Assessment questionnaire works
- [ ] AI predictions return results
- [ ] Reviews can be submitted
- [ ] No console errors

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies are in package.json
- Ensure environment variables are set

### API Not Working
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings
- Verify MongoDB connection string

### AI Service Not Responding
- Check AI service logs on Railway/Render
- Verify `REACT_APP_AI_URL` is correct
- Ensure AI service is running

## Important Notes

⚠️ **Security**
- Never commit `.env` files to Git
- Use strong JWT_SECRET (min 32 characters)
- Rotate secrets regularly

⚠️ **MongoDB**
- Use MongoDB Atlas for production
- Don't use local MongoDB
- Whitelist Vercel IPs (use 0.0.0.0/0 for simplicity)

⚠️ **AI Service**
- Must be deployed separately (too large for Vercel)
- Railway or Render recommended
- Ensure model files are included in deployment

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Logged into Vercel CLI
- [ ] AI service deployed (Railway/Render)
- [ ] AI service URL obtained
- [ ] Vercel deployment initiated
- [ ] All environment variables added
- [ ] Production deployment completed
- [ ] Application tested and verified
