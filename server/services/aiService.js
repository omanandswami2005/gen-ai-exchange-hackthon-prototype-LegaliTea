import {
  GoogleGenAI,
} from '@google/genai';
import { getLanguageName } from '../utils/languageUtils.js';
import { generateFallbackAnalysis } from '../utils/fallbackAnalysis.js';
import 'dotenv/config';

class AIService {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || 'AIzaSyAHExmwYmdSR28QOfOBQiQfaQYAmeREpXI',
        });
        this.model = 'gemini-2.5-flash';
    }

    async analyzeDocument(text, documentType = 'document', language = 'en') {
        try {
            const prompt = this.buildAnalysisPrompt(text, language);
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ];

            const response = await this.ai.models.generateContentStream({
                model: this.model,
                contents,
            });

            let analysisText = '';
            for await (const chunk of response) {
                analysisText += chunk.text;
            }

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

    async explainTerm(term, context, documentType, language = 'en') {
        try {
            const prompt = this.buildTermExplanationPrompt(term, context, documentType, language);
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ];

            const response = await this.ai.models.generateContentStream({
                model: this.model,
                contents,
            });

            let explanationText = '';
            for await (const chunk of response) {
                explanationText += chunk.text;
            }
            explanationText = explanationText.trim();

            // Clean up JSON response
            if (explanationText.startsWith('```json')) {
                explanationText = explanationText.replace(/```json\n?/, '').replace(/\n?```$/, '');
            } else if (explanationText.startsWith('```')) {
                explanationText = explanationText.replace(/```\n?/, '').replace(/\n?```$/, '');
            }

            const explanation = JSON.parse(explanationText);
            return explanation;
        } catch (error) {
            console.error('Term explanation error:', error);
            return {
                term,
                definition: "This appears to be a legal term. Please consult a legal professional for accurate definition.",
                category: "legal",
                complexity: "intermediate"
            };
        }
    }

    async generateScenarios(clause, documentType, language = 'en') {
        try {
            const prompt = this.buildScenarioPrompt(clause, documentType, language);
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ];

            const response = await this.ai.models.generateContentStream({
                model: this.model,
                contents,
            });

            let scenarioText = '';
            for await (const chunk of response) {
                scenarioText += chunk.text;
            }
            scenarioText = scenarioText.trim();

            // Clean up JSON response
            if (scenarioText.startsWith('```json')) {
                scenarioText = scenarioText.replace(/```json\n?/, '').replace(/\n?```$/, '');
            } else if (scenarioText.startsWith('```')) {
                scenarioText = scenarioText.replace(/```\n?/, '').replace(/\n?```$/, '');
            }

            const scenarios = JSON.parse(scenarioText);
            return scenarios;
        } catch (error) {
            console.error('Scenario generation error:', error);
            return {
                scenarios: [{
                    id: "fallback_1",
                    title: "General Scenario",
                    situation: "This clause may have legal implications",
                    consequences: ["Consult a legal professional for specific advice"],
                    severity: "medium"
                }]
            };
        }
    }

    async generateQuiz(documentText, difficulty = 'medium', language = 'en') {
        try {
            const prompt = this.buildQuizPrompt(documentText, difficulty, language);
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ];

            const response = await this.ai.models.generateContentStream({
                model: this.model,
                contents,
            });

            let quizText = '';
            for await (const chunk of response) {
                quizText += chunk.text;
            }
            quizText = quizText.trim();

            // Clean up JSON response
            if (quizText.startsWith('```json')) {
                quizText = quizText.replace(/```json\n?/, '').replace(/\n?```$/, '');
            } else if (quizText.startsWith('```')) {
                quizText = quizText.replace(/```\n?/, '').replace(/\n?```$/, '');
            }

            const quiz = JSON.parse(quizText);
            return quiz;
        } catch (error) {
            console.error('Quiz generation error:', error);
            return {
                quiz: {
                    title: "Basic Legal Quiz",
                    questions: [{
                        id: "q1",
                        type: "multiple_choice",
                        question: "What should you do when reviewing a legal document?",
                        options: ["Sign immediately", "Read carefully", "Ignore it", "Guess the meaning"],
                        correctAnswer: "Read carefully",
                        explanation: "Always read legal documents carefully before signing.",
                        points: 10
                    }]
                }
            };
        }
    }

    buildAnalysisPrompt(text, language) {
        return `You are an advanced legal document analysis assistant. Analyze the provided legal document and return a comprehensive analysis with interactive features in JSON format. Focus on making complex legal language accessible to non-lawyers.

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
  "actionPlan": [{"id": "1", "task": "specific action to take", "priority": "high/medium/low", "deadline": "when to do this or null", "completed": false}],
  "interactiveTerms": [{"term": "legal term", "definition": "simple explanation", "positions": [{"start": 0, "end": 10}], "category": "legal|financial|temporal|obligation", "complexity": "basic|intermediate|advanced"}],
  "clauseSimplifications": [{"originalClause": "complex legal text", "simplifiedClause": "plain English version", "confidence": 0.9, "clauseType": "obligation|right|condition|penalty"}],
  "contractVisualization": {
    "mermaidDiagram": "graph TD\\n    A[Party 1] -->|obligation| B[Party 2]\\n    B -->|payment| A",
    "nodes": [{"id": "A", "label": "Party 1", "type": "party"}, {"id": "B", "label": "Party 2", "type": "party"}],
    "relationships": [{"from": "A", "to": "B", "type": "obligation", "description": "specific obligation"}]
  },
  "realLifeScenarios": [{"title": "What if scenario", "situation": "realistic situation", "consequences": ["consequence 1", "consequence 2"], "severity": "low|medium|high", "relatedClauses": ["clause reference"]}],
  "smartGlossary": [{"term": "legal term", "definition": "simple definition", "category": "legal|financial|temporal", "frequency": 3, "importance": "high|medium|low"}]
}

Important guidelines:
- Use simple, non-legal language that anyone can understand
- Focus on practical implications and risks
- Be specific about dates, amounts, and obligations
- Highlight unusual or concerning clauses
- Provide actionable recommendations
- Create realistic scenarios that help users understand consequences
- Generate a comprehensive glossary of all legal terms
- Create a visual representation of contract relationships
- Simplify complex clauses into plain language
- Ensure all JSON is valid and properly formatted

Document to analyze:

IMPORTANT: Please provide the analysis in ${getLanguageName(language)} language. All explanations, summaries, and recommendations should be in ${getLanguageName(language)}.

${text}`;
    }

    buildTermExplanationPrompt(term, context, documentType, language) {
        return `You are a legal term explanation assistant. Provide a clear, concise explanation of the legal term in context.

Respond with ONLY a valid JSON object in this format:
{
  "term": "${term}",
  "definition": "Simple, clear definition in plain language",
  "contextualDefinition": "How this term applies in the specific context provided",
  "category": "legal|financial|temporal|obligation|right|condition",
  "complexity": "basic|intermediate|advanced",
  "examples": ["practical example 1", "practical example 2"],
  "relatedTerms": ["related term 1", "related term 2"],
  "consequences": "What happens if this term is violated or activated"
}

Term to explain: "${term}"
Context: "${context || 'General legal context'}"
Document type: "${documentType || 'legal document'}"

IMPORTANT: Provide the explanation in ${getLanguageName(language)} language.`;
    }

    buildScenarioPrompt(clause, documentType, language) {
        return `You are a legal scenario generator. Create realistic, practical scenarios that help users understand the consequences of legal clauses.

Generate 3 different scenarios for the given clause. Respond with ONLY a valid JSON object:

{
  "scenarios": [
    {
      "id": "scenario_1",
      "title": "Descriptive scenario title",
      "situation": "Realistic situation description",
      "trigger": "What causes this scenario",
      "consequences": ["consequence 1", "consequence 2", "consequence 3"],
      "severity": "low|medium|high",
      "likelihood": "low|medium|high",
      "prevention": "How to avoid this scenario",
      "proTip": "Practical advice for users"
    }
  ]
}

Clause to analyze: "${clause}"
Document type: "${documentType || 'legal document'}"

IMPORTANT: Generate scenarios in ${getLanguageName(language)} language. Make them practical and easy to understand.`;
    }

    buildQuizPrompt(documentText, difficulty, language) {
        return `You are a legal education quiz generator. Create educational quiz questions based on the legal document to help users learn and test their understanding.

Generate 5 quiz questions of varying types. Respond with ONLY a valid JSON object:

{
  "quiz": {
    "title": "Legal Document Quiz",
    "difficulty": "${difficulty}",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice|true_false|fill_blank",
        "question": "Question text",
        "options": ["option 1", "option 2", "option 3", "option 4"],
        "correctAnswer": "correct option or index",
        "explanation": "Why this is the correct answer",
        "points": 10,
        "category": "terms|clauses|obligations|rights"
      }
    ]
  }
}

Document excerpt: "${documentText.substring(0, 2000)}..."
Difficulty level: ${difficulty}

IMPORTANT: Generate quiz in ${getLanguageName(language)} language. Focus on practical understanding, not memorization.`;
    }
}

export default new AIService();