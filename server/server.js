import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🍵 LegaliTea Server running on http://localhost:${PORT}`);
    console.log(`🤖 Gemini API configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});