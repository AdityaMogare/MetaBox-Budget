# Ollama Setup Guide for Movie Magic Budgeting

This guide will help you set up Ollama (open-source LLM) to enable AI chat functionality in the Movie Magic Budgeting application.

## What is Ollama?

Ollama is an open-source framework that allows you to run large language models locally on your machine. It provides a simple way to run models like Llama 2, Mistral, and others without needing cloud services.

## Installation

### 1. Install Ollama

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from https://ollama.ai/download

### 2. Start Ollama

After installation, start the Ollama service:

```bash
ollama serve
```

### 3. Download a Model

Download a model that works well for chat applications:

```bash
# For a smaller, faster model
ollama pull llama2:7b

# For a more capable model (requires more RAM)
ollama pull llama2:13b

# Alternative: Mistral model
ollama pull mistral:7b
```

## Integration with Movie Magic Budgeting

### 1. Verify Ollama is Running

The application will automatically detect if Ollama is available at `http://localhost:11434`. You can verify this by visiting:
```
http://localhost:11434/api/tags
```

### 2. Test the Integration

1. Start the Movie Magic Budgeting application:
   ```bash
   npm run dev
   ```

2. Navigate to the Dashboard
3. Look for the AI Chat section
4. Try asking questions like:
   - "Create a feature film budget template"
   - "Analyze my current budget"
   - "What categories should I use for a documentary?"

### 3. AI Chat Features

The AI assistant can help you with:

- **Budget Templates**: Create templates for different project types
- **Budget Analysis**: Analyze your current spending and provide insights
- **Recommendations**: Get industry-standard advice
- **Category Help**: Understand which categories to use
- **Template Application**: Apply pre-built templates to your budget

## Configuration

### Model Selection

You can change the model used by editing `src/services/ollamaService.ts`:

```typescript
constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama2') {
  this.baseUrl = baseUrl
  this.model = model
}
```

### Available Models

Common models you can use:
- `llama2:7b` - Fast, good for basic tasks
- `llama2:13b` - More capable, requires more RAM
- `mistral:7b` - Good balance of speed and capability
- `codellama:7b` - Good for technical tasks

### Custom Models

You can create custom models with specific prompts for movie budgeting:

```bash
# Create a custom model file
cat > MovieBudgetAssistant.modelfile << EOF
FROM llama2:7b

SYSTEM You are an expert movie budgeting assistant. You help filmmakers create and manage budgets for their projects. You have deep knowledge of industry standards, categories, and best practices.
EOF

# Create the model
ollama create movie-budget-assistant -f MovieBudgetAssistant.modelfile

# Use it in the application
ollamaService.setModel('movie-budget-assistant')
```

## Troubleshooting

### Ollama Not Starting
```bash
# Check if Ollama is running
ps aux | grep ollama

# Restart Ollama
pkill ollama
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Pull a specific model
ollama pull llama2:7b
```

### Memory Issues
If you're running out of memory:
1. Use smaller models (7b instead of 13b)
2. Close other applications
3. Increase swap space

### Network Issues
If the application can't connect to Ollama:
1. Verify Ollama is running on port 11434
2. Check firewall settings
3. Try accessing `http://localhost:11434/api/tags` in your browser

## Advanced Features

### Custom Prompts

You can customize the prompts used by the AI by editing the `formatPrompt` method in `src/services/ollamaService.ts`.

### Streaming Responses

For real-time responses, you can enable streaming by modifying the service:

```typescript
const requestBody: OllamaRequest = {
  model: model || this.model,
  prompt: this.formatPrompt(prompt),
  stream: true  // Enable streaming
}
```

### Multiple Models

You can switch between different models based on the task:

```typescript
// For budget analysis
await ollamaService.generateResponse(prompt, 'llama2:13b')

// For quick responses
await ollamaService.generateResponse(prompt, 'llama2:7b')
```

## Performance Tips

1. **Use appropriate model size**: 7b models are faster, 13b models are more capable
2. **Keep Ollama running**: Start it once and leave it running
3. **Monitor memory usage**: Larger models require more RAM
4. **Use SSD storage**: Models load faster from SSD

## Security Notes

- Ollama runs locally on your machine
- No data is sent to external services
- Models are downloaded and stored locally
- You have full control over your data

## Support

If you encounter issues:

1. Check the Ollama documentation: https://ollama.ai/docs
2. Verify your model is downloaded: `ollama list`
3. Test Ollama directly: `ollama run llama2:7b`
4. Check the browser console for error messages

The AI chat feature will gracefully fall back to predefined responses if Ollama is not available, so the application will still work even without Ollama running. 