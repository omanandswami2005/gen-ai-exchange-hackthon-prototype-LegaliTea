# 🖥️ LegaliTea Server Architecture

## 📁 **Directory Structure**

```
server/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── routes/
│   ├── analysis.js       # AI analysis endpoints
│   └── health.js         # Health check endpoints
├── services/
│   └── aiService.js      # Google Gemini AI integration
├── middleware/
│   ├── errorHandler.js   # Global error handling
│   ├── requestLogger.js  # Request logging
│   ├── rateLimiter.js    # Rate limiting
│   └── validation.js     # Request validation
├── utils/
│   ├── languageUtils.js  # Language utilities
│   └── fallbackAnalysis.js # Fallback analysis
└── README.md             # This file
```

## 🚀 **Key Improvements**

### **1. Modular Architecture**

- **Separation of Concerns**: Each module has a single responsibility
- **Maintainable Code**: Easy to update and extend individual components
- **Testable**: Each module can be unit tested independently
- **Scalable**: Easy to add new features and endpoints

### **2. Enhanced Error Handling**

- **Global Error Handler**: Centralized error processing
- **Specific Error Types**: Different handling for validation, AI, and system errors
- **Production Safety**: Sensitive error details hidden in production
- **Structured Responses**: Consistent error response format

### **3. Request Validation**

- **Input Sanitization**: Validates all incoming requests
- **Type Checking**: Ensures correct data types
- **Length Limits**: Prevents oversized requests
- **Email Validation**: Proper email format checking

### **4. Performance & Security**

- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Request Logging**: Detailed request/response logging with timing
- **Memory Monitoring**: Health endpoint shows memory usage
- **CORS Configuration**: Proper cross-origin request handling

### **5. AI Service Abstraction**

- **Service Layer**: Clean separation between routes and AI logic
- **Fallback Handling**: Graceful degradation when AI fails
- **Multiple AI Methods**: Support for different AI operations
- **Language Support**: Multi-language prompt generation

## 🔧 **API Endpoints**

### **Health Endpoints**

```
GET /api/health          # Basic health check
GET /api/health/detailed # Detailed system information
```

### **Analysis Endpoints**

```
POST /api/analyze           # Main document analysis
POST /api/explain-term      # Term explanation
POST /api/generate-scenarios # Scenario generation
POST /api/generate-quiz     # Quiz generation
POST /api/save              # Save analysis
```

## 📊 **Request/Response Examples**

### **Document Analysis**

```javascript
// Request
POST /api/analyze
{
  "text": "This is a legal document...",
  "documentType": "contract",
  "language": "en"
}

// Response
{
  "summary": { ... },
  "keyInformation": { ... },
  "riskAssessment": { ... },
  "actionPlan": [ ... ],
  // ... additional analysis data
}
```

### **Term Explanation**

```javascript
// Request
POST /api/explain-term
{
  "term": "indemnify",
  "context": "The contractor shall indemnify...",
  "documentType": "contract",
  "language": "en"
}

// Response
{
  "term": "indemnify",
  "definition": "To protect someone from legal responsibility...",
  "contextualDefinition": "In this contract context...",
  "category": "legal",
  "complexity": "intermediate",
  "examples": [ ... ],
  "relatedTerms": [ ... ]
}
```

## 🛡️ **Security Features**

### **Rate Limiting**

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Headers**: Rate limit info in response headers
- **Memory Store**: In-memory storage (use Redis in production)

### **Input Validation**

- **Text Length**: Maximum 50,000 characters
- **Required Fields**: Validates required parameters
- **Type Checking**: Ensures correct data types
- **Email Format**: Validates email addresses

### **Error Handling**

- **Sanitized Errors**: No sensitive information exposed
- **Status Codes**: Proper HTTP status codes
- **Logging**: All errors logged for debugging
- **Fallback**: Graceful degradation when services fail

## 🔄 **Development Workflow**

### **Starting the Server**

```bash
# Development
npm run server

# Production
NODE_ENV=production npm run server
```

### **Environment Variables**

```env
# Required
VITE_GEMINI_API_KEY=your_api_key

# Optional
NODE_ENV=development
PORT=3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### **Adding New Endpoints**

1. Create route handler in `routes/`
2. Add validation middleware in `middleware/validation.js`
3. Implement business logic in `services/`
4. Add error handling as needed
5. Update this documentation

### **Adding New AI Features**

1. Add method to `aiService.js`
2. Create prompt builder method
3. Add route handler
4. Add validation middleware
5. Test with fallback scenarios

## 📈 **Monitoring & Logging**

### **Request Logging**

- **Format**: `timestamp - METHOD path - STATUS - duration`
- **Colors**: Green for success, red for errors
- **Timing**: Response time in milliseconds

### **Health Monitoring**

- **Basic**: Status, uptime, version
- **Detailed**: Memory usage, system info, service status
- **Services**: Gemini AI and Supabase connection status

### **Error Tracking**

- **Console Logging**: All errors logged to console
- **Stack Traces**: Available in development mode
- **Error Categories**: Validation, AI service, system errors

## 🧪 **Testing**

### **Manual Testing**

```bash
# Health check
curl http://localhost:3001/api/health

# Document analysis
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample legal text","language":"en"}'
```

### **Error Testing**

```bash
# Rate limiting
for i in {1..105}; do curl http://localhost:3001/api/health; done

# Validation errors
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🚀 **Production Deployment**

### **Environment Setup**

```bash
# Set production environment
export NODE_ENV=production

# Set API keys
export VITE_GEMINI_API_KEY=your_production_key

# Start server
npm run server
```

### **Production Considerations**

- **Rate Limiting**: Use Redis for distributed rate limiting
- **Logging**: Use structured logging (Winston, Bunyan)
- **Monitoring**: Add APM tools (New Relic, DataDog)
- **Load Balancing**: Use nginx or cloud load balancers
- **Database**: Implement proper Supabase integration
- **Caching**: Add Redis for response caching

## 🔮 **Future Enhancements**

### **Planned Features**

- **Database Integration**: Full Supabase implementation
- **User Authentication**: JWT-based auth system
- **File Upload**: Direct file upload handling
- **Caching**: Redis-based response caching
- **WebSocket**: Real-time analysis updates
- **Metrics**: Prometheus/Grafana monitoring

### **Scalability Improvements**

- **Microservices**: Split into smaller services
- **Queue System**: Background job processing
- **CDN Integration**: Static asset delivery
- **Auto-scaling**: Kubernetes deployment
- **Multi-region**: Global deployment strategy

---

This refactored server architecture provides a solid foundation for the LegaliTea application with improved maintainability, security, and scalability.
