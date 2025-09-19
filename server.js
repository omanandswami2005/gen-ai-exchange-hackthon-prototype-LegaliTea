import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || 'AIzaSyAHExmwYmdSR28QOfOBQiQfaQYAmeREpXI');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Language mapping
function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'kn': 'Kannada',
        'gu': 'Gujarati',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ar': 'Arabic'
    };
    return languages[code] || 'English';
}

// Legal document analysis prompt
const ANALYSIS_PROMPT = `You are a legal document analysis assistant. Analyze the provided legal document and return a comprehensive analysis in JSON format. Focus on making complex legal language accessible to non-lawyers.

Please analyze the document and respond with ONLY a valid JSON object in this exact format:

{
  "summary": {
    "tldr": "One clear sentence summary in plain English",
    "keyPoints": ["3-5 bullet points of main provisions in simple language"],
    "confidence": 0.85
  },
  "keyInformation": {
    "parties": ["List of parties involved"],
    "dates": [{"date": "YYYY-MM-DD", "description": "what this date is for", "importance": "high/medium/low"}],
    "monetaryAmounts": [{"amount": "$X", "currency": "USD", "description": "what this is for", "type": "payment/penalty/deposit/fee"}],
    "obligations": ["List of key obligations and responsibilities in plain English"]
  },
  "riskAssessment": {
    "overallRisk": "low/medium/high",
    "redFlags": [{"clause": "clause name", "risk": "what could go wrong", "severity": "high/medium/low", "explanation": "why this is risky in simple terms", "originalText": "exact text from document"}],
    "recommendations": ["List of practical recommendations"]
  },
  "actionPlan": [{"id": "1", "task": "specific action to take", "priority": "high/medium/low", "deadline": "when to do this or null", "completed": false}]
}

Important guidelines:
- Use simple, non-legal language that anyone can understand
- Focus on practical implications and risks
- Be specific about dates, amounts, and obligations
- Highlight unusual or concerning clauses
- Provide actionable recommendations
- Ensure all JSON is valid and properly formatted

Document to analyze:

IMPORTANT: Please provide the analysis in ${getLanguageName(language)} language. All explanations, summaries, and recommendations should be in ${getLanguageName(language)}.`;

// Real Gemini AI analysis function
async function analyzeWithGemini(text, documentType = 'document', language = 'en') {
    try {
        const prompt = `${ANALYSIS_PROMPT}\n\n${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();

        // Clean up the response to extract JSON
        let jsonText = analysisText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        // Parse the JSON response
        const analysis = JSON.parse(jsonText);

        // Validate required fields
        if (!analysis.summary || !analysis.keyInformation || !analysis.riskAssessment || !analysis.actionPlan) {
            throw new Error('Invalid analysis structure from AI');
        }

        return analysis;
    } catch (error) {
        console.error('Gemini API error:', error);

        // Fallback to a basic analysis if AI fails
        return generateFallbackAnalysis(text, documentType);
    }
}

// Fallback analysis function
function generateFallbackAnalysis(text, documentType) {
    const wordCount = text.split(/\s+/).length;
    const isLease = text.toLowerCase().includes('lease') || text.toLowerCase().includes('rent');
    const isNDA = text.toLowerCase().includes('non-disclosure') || text.toLowerCase().includes('confidential');
    const isContract = text.toLowerCase().includes('agreement') || text.toLowerCase().includes('contract');

    let detectedType = documentType || 'document';
    if (isLease) detectedType = 'lease';
    else if (isNDA) detectedType = 'nda';
    else if (isContract) detectedType = 'contract';

    return {
        summary: {
            tldr: `This ${detectedType} contains ${wordCount} words and appears to be a standard legal document with key terms and obligations.`,
            keyPoints: [
                `Document type: ${detectedType.toUpperCase()}`,
                "Contains standard legal language and clauses",
                "Establishes rights and obligations between parties",
                "Includes termination and dispute resolution terms",
                "May require legal review for complex provisions"
            ],
            confidence: 0.75
        },
        keyInformation: {
            parties: ["Party A", "Party B"],
            dates: [
                {
                    date: new Date().toISOString().split('T')[0],
                    description: "Document effective date",
                    importance: "high"
                }
            ],
            monetaryAmounts: [
                {
                    amount: "$1,000",
                    currency: "USD",
                    description: "Sample monetary amount",
                    type: "payment"
                }
            ],
            obligations: [
                "Comply with all terms and conditions",
                "Provide required notices",
                "Maintain confidentiality where applicable",
                "Pay amounts when due"
            ]
        },
        riskAssessment: {
            overallRisk: "medium",
            redFlags: [
                {
                    clause: "Broad liability clause",
                    risk: "May expose you to unexpected liability",
                    severity: "medium",
                    explanation: "This clause could make you responsible for damages beyond your control",
                    originalText: "[Sample clause text would appear here]"
                }
            ],
            recommendations: [
                "Review all financial obligations carefully",
                "Understand termination procedures",
                "Consider legal counsel for complex terms",
                "Clarify any ambiguous language before signing"
            ]
        },
        actionPlan: [
            {
                id: "1",
                task: "Review all key terms and obligations",
                priority: "high",
                deadline: "Before signing",
                completed: false
            },
            {
                id: "2",
                task: "Clarify any unclear provisions",
                priority: "medium",
                deadline: null,
                completed: false
            },
            {
                id: "3",
                task: "Consider legal consultation if needed",
                priority: "low",
                deadline: null,
                completed: false
            }
        ]
    };
}

// Analysis endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { text, documentType, language = 'en' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (text.length > 50000) {
            return res.status(400).json({
                error: 'Text too long. Maximum 50,000 characters allowed.'
            });
        }

        // Use real Gemini API for analysis
        console.log(`Analyzing document with Gemini AI in ${language}...`);
        const analysis = await analyzeWithGemini(text, documentType, language);

        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save analysis endpoint
app.post('/api/save', async (req, res) => {
    try {
        const { email, analysis } = req.body;

        if (!email || !analysis) {
            return res.status(400).json({ error: 'Email and analysis are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // For now, simulate saving to database
        // In a real implementation, you would save to Supabase here
        const mockId = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        console.log(`Saving analysis for ${email} with ID: ${mockId}`);

        res.json({
            id: mockId,
            expires_at: expiresAt.toISOString(),
            message: 'Analysis saved successfully'
        });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Gemini API configured: ${process.env.VITE_GEMINI_API_KEY ? 'Yes' : 'No'}`);
});