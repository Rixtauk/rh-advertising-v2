# Deploying to Vercel

This guide shows you how to deploy both the web frontend and API to Vercel.

## Prerequisites

- GitHub repository: `Rixtauk/rh-advertising-v2`
- Vercel account connected to GitHub

## Step 1: Deploy the API

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `Rixtauk/rh-advertising-v2`
4. Configure the project:
   - **Project Name:** `rh-advertising-api`
   - **Root Directory:** `api` ← **IMPORTANT**
   - **Framework Preset:** Other
5. Add Environment Variables:
   ```
   OPENAI_API_KEY=your-openai-key-here
   MODEL_GENERATION=gpt-4o
   MODEL_GENERATION_MINI=gpt-4o-mini
   REQUEST_TIMEOUT_SECONDS=20
   LOG_LEVEL=INFO
   CORS_ALLOW_ORIGINS=https://your-web-app.vercel.app
   ```
6. Click "Deploy"
7. **Save the deployment URL** (e.g., `https://rh-advertising-api.vercel.app`)

## Step 2: Deploy the Web Frontend

1. Go to https://vercel.com/new again
2. Click "Import Git Repository"
3. Select `Rixtauk/rh-advertising-v2` again
4. Configure the project:
   - **Project Name:** `rh-advertising-web`
   - **Root Directory:** `web` ← **IMPORTANT**
   - **Framework Preset:** Next.js (auto-detected)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://rh-advertising-api.vercel.app
   NEXT_PUBLIC_APP_NAME=RH AI Assistant
   ```
6. Click "Deploy"

## Step 3: Update CORS

After the web app is deployed:

1. Note your web app URL (e.g., `https://rh-advertising-web.vercel.app`)
2. Go back to the API project settings in Vercel
3. Update the `CORS_ALLOW_ORIGINS` environment variable:
   ```
   CORS_ALLOW_ORIGINS=https://rh-advertising-web.vercel.app,https://rh-advertising-web-*.vercel.app
   ```
4. Redeploy the API

## Done!

Your app is now deployed:
- **Web:** https://rh-advertising-web.vercel.app
- **API:** https://rh-advertising-api.vercel.app

## Cost

- Free for hobby projects
- Pro plan: $20/month per user (if you need more usage)

## Automatic Deployments

Every time you push to GitHub:
- Main branch → Production deployment
- Other branches → Preview deployments

## Troubleshooting

### "Root directory not found"
- Make sure you set the Root Directory to `web` or `api` (not `/web` or `/api`)

### API not responding
- Check the Vercel function logs
- FastAPI apps run as serverless functions on Vercel
- Each request is a cold start initially

### CORS errors
- Make sure `CORS_ALLOW_ORIGINS` in the API includes your web app URL
- Include preview deployment URLs with wildcard: `https://your-app-*.vercel.app`
