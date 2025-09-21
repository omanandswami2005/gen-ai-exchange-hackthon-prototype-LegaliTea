import app from './app.js';
import 'dotenv/config';
import { fileURLToPath } from 'url';

// Determine current file path
const thisFile = fileURLToPath(import.meta.url);

const PORT = process.env.PORT || 3001;

// ✅ Export for Vercel serverless functions
export default app;

// ✅ Local development only
if (process.argv[1] === thisFile) {
    app.listen(PORT, () => {
        console.log(`🍵 LegaliTea Server running on http://localhost:${PORT}`);
        console.log(`🤖 Gemini API configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Catch hidden crashes
    process.on('unhandledRejection', (reason) => {
        console.error("❌ Unhandled Rejection:", reason);
    });
    process.on('uncaughtException', (err) => {
        console.error("❌ Uncaught Exception:", err);
    });
}
