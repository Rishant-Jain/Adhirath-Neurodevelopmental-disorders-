# CORS Configuration Guide for Vercel Deployment

## What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a security feature that controls which websites can access your backend APIs. When your frontend (on Vercel) tries to call your backend (on Render), the browser checks if the backend allows requests from that domain.

## What I Changed

### 1. Backend (Node.js) - `server.js`

**Before:**
```javascript
app.use(cors()); // Allowed ALL domains (insecure)
```

**After:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',                    // Local development
  'https://adhirath.vercel.app',              // Your Vercel domain
  /^https:\/\/.*\.vercel\.app$/,              // All Vercel preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Checks if the requesting domain is allowed
    // ...
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. AI Service (Python/FastAPI) - `main.py`

**Before:**
```python
allow_origins=["*"]  # Allowed ALL domains (insecure)
```

**After:**
```python
allowed_origins = [
    "http://localhost:3000",                    # Local development
    "https://adhirath.vercel.app",              # Your Vercel domain
    "https://*.vercel.app",                     # All Vercel preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # ...
)
```

## What You Need to Do

### Step 1: Get Your Vercel Domain

After deploying to Vercel, you'll get a URL like:
- `https://adhirath-neurodevelopmental.vercel.app`
- or `https://your-custom-name.vercel.app`

### Step 2: Update the CORS Configuration

**IMPORTANT:** Replace `https://adhirath.vercel.app` in BOTH files with your actual Vercel domain.

**In `backend/server.js` (line 21):**
```javascript
'https://your-actual-vercel-domain.vercel.app',  // Replace this
```

**In `ai-service/main.py` (line 21):**
```python
"https://your-actual-vercel-domain.vercel.app",  # Replace this
```

### Step 3: Push Changes to GitHub

```bash
git add .
git commit -m "Update CORS configuration for Vercel deployment"
git push
```

### Step 4: Redeploy on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Find your **backend** service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Repeat for your **AI service**

## Why This Matters

Without proper CORS configuration:
- ❌ Your Vercel frontend will get **CORS errors**
- ❌ API calls will be **blocked by the browser**
- ❌ Users won't be able to login, signup, or use features

With proper CORS configuration:
- ✅ Your Vercel frontend can communicate with Render backend
- ✅ Secure - only your domains are allowed
- ✅ Works for both production and preview deployments

## Testing

After redeploying on Render:
1. Open your Vercel app in browser
2. Open Developer Tools (F12) → Console tab
3. Try to login or use a feature
4. You should see **successful API calls** with no CORS errors

If you see CORS errors, double-check:
- The domain in CORS config matches your Vercel URL exactly
- Both backend and AI service have been redeployed on Render
- The environment variables in Vercel point to the correct Render URLs
