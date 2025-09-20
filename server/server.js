const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Export for Vercel serverless functions
module.exports = app;

// For local development only
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🍵 LegaliTea Server running on http://localhost:${PORT}`);
        console.log(`🤖 Gemini API configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}