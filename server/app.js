import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import analysisRoutes from './routes/analysis.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api', analysisRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
}

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;