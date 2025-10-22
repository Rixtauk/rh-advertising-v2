# Deploy API to Railway

Railway is the easiest way to deploy your FastAPI backend. It works great with Docker.

## Quick Deploy (5 minutes)

### Step 1: Sign up for Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Authorize Railway to access your repositories

### Step 2: Deploy the API
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select **`Rixtauk/rh-advertising-v2`**
4. Railway will auto-detect your services. Select **"api"** folder
5. Click **"Add variables"** and add:
   ```
   OPENAI_API_KEY=your-key-here
   MODEL_GENERATION=gpt-4o
   MODEL_GENERATION_MINI=gpt-4o-mini
   REQUEST_TIMEOUT_SECONDS=20
   LOG_LEVEL=INFO
   CORS_ALLOW_ORIGINS=https://rh-advertising-v2.vercel.app,https://rh-advertising-v2-*.vercel.app
   PORT=8000
   ```
6. Click **"Deploy"**

### Step 3: Get Your API URL
1. Once deployed, Railway will give you a URL like: `https://rh-advertising-api-production.up.railway.app`
2. Copy this URL - you'll need it for the next step

### Step 4: Update Your Web App
1. Go to your Vercel project: https://vercel.com/rixtauks-projects/rh-advertising-v2
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to your Railway API URL
4. Redeploy your web app

## Done!
Your app should now be fully functional:
- **Web:** https://rh-advertising-v2.vercel.app
- **API:** https://your-railway-url.up.railway.app

## Cost
- **Free tier:** $5/month in credits (usually enough for small apps)
- **Pro plan:** $20/month if you need more

## Troubleshooting

### Build fails
- Make sure you selected the `api` folder as the root directory
- Railway should auto-detect the Dockerfile

### API returns errors
- Check the logs in Railway dashboard
- Make sure OPENAI_API_KEY is set correctly

### CORS errors
- Make sure CORS_ALLOW_ORIGINS includes your Vercel domain
- Include wildcard for preview deployments: `https://rh-advertising-v2-*.vercel.app`
