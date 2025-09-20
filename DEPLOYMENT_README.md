# 🚀 LegaliTea AI - Vercel Deployment Guide

## Overview
Your Express.js server has been prepared for Vercel deployment with all the necessary changes to support serverless functions.

## Changes Made

### ✅ Converted to CommonJS
- All ES modules (`import/export`) converted to CommonJS (`require/module.exports`)
- Required for Vercel serverless functions

### ✅ Updated Files
- `server/server.js` - Main entry point with Vercel export
- `server/app.js` - Express app configuration
- `server/routes/analysis.js` - API routes
- `server/routes/health.js` - Health check routes
- `server/middleware/errorHandler.js` - Error handling
- `server/middleware/requestLogger.js` - Request logging
- `server/middleware/rateLimiter.js` - Rate limiting
- `server/middleware/validation.js` - Request validation
- `server/services/aiService.js` - AI service
- `server/utils/languageUtils.js` - Language utilities
- `server/utils/fallbackAnalysis.js` - Fallback analysis

### ✅ Vercel Configuration
- Created `vercel.json` with proper routing and build configuration

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy to Vercel
```bash
# Navigate to your project directory
cd legalitea

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy "~/legalitea"? [Y/n] Y
# ? Which scope? [your-username]
# ? Link to existing project? [n] N
# ? What's your project's name? legalitea-ai
# ? In which directory is your code located? ./
```

### 3. Set Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:
```env
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=production
```

### 4. Production Deployment
```bash
vercel --prod
```

## API Endpoints

After deployment, your API will be available at:
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/analyze` - Document analysis
- `https://your-app.vercel.app/api/explain-term` - Term explanation
- `https://your-app.vercel.app/api/generate-scenarios` - Scenario generation
- `https://your-app.vercel.app/api/generate-quiz` - Quiz generation
- `https://your-app.vercel.app/api/save` - Save analysis

## Local Development

Your server still works locally:
```bash
cd legalitea
npm run dev:full
```

## Important Notes

### ✅ Preserved All Logic
- All your existing business logic remains unchanged
- All API endpoints work the same way
- All middleware functionality preserved
- All error handling maintained

### ✅ Vercel Compatibility
- Express app exports properly for serverless functions
- Static file serving configured (uses `public/` directory)
- Environment variables properly configured
- Function timeout set to 30 seconds for AI processing

### ✅ Performance
- Bundle optimized for serverless deployment
- Rate limiting preserved for abuse prevention
- Error handling optimized for production

## Troubleshooting

### Common Issues:
1. **API Key Not Found**: Check Vercel environment variables
2. **CORS Errors**: Update allowed origins in Express server
3. **Bundle Size**: Your app is optimized for Vercel's 250MB limit
4. **Function Timeout**: AI processing has 30-second timeout

### Debug Commands:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback if needed
vercel rollback
```

## Next Steps

1. **Test Deployment**: Deploy and test all API endpoints
2. **Frontend Integration**: Update your React app API calls
3. **Domain Setup**: Add custom domain if needed
4. **Monitoring**: Set up error tracking and analytics

Your LegaliTea AI server is now ready for Vercel deployment! 🎉