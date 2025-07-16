// Ollama service for AI chat integration
// This service provides methods to interact with local Ollama instances

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

interface OllamaRequest {
  model: string
  prompt: string
  stream?: boolean
}

class OllamaService {
  private baseUrl: string
  private model: string

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama2') {
    this.baseUrl = baseUrl
    this.model = model
  }

  // Check if Ollama is running
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      return response.ok
    } catch (error) {
      console.warn('Ollama not available:', error)
      return false
    }
  }

  // Get available models
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      const data = await response.json()
      return data.models?.map((model: any) => model.name) || []
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }

  // Generate response from Ollama
  async generateResponse(prompt: string, model?: string): Promise<string> {
    try {
      const requestBody: OllamaRequest = {
        model: model || this.model,
        prompt: this.formatPrompt(prompt),
        stream: false
      }

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OllamaResponse = await response.json()
      return data.response
    } catch (error) {
      console.error('Error generating response:', error)
      return this.getFallbackResponse(prompt)
    }
  }

  // Format prompt for movie budgeting context
  private formatPrompt(userInput: string): string {
    return `You are an expert movie budgeting assistant. You help filmmakers create and manage budgets for their projects.

Context: You have access to industry-standard movie budgeting categories and can provide intelligent recommendations.

User input: ${userInput}

Please provide a helpful, professional response that includes:
- Clear explanations
- Industry best practices
- Specific recommendations when appropriate
- Professional tone

Response:`
  }

  // Fallback response when Ollama is not available
  private getFallbackResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('template') || lowerInput.includes('create')) {
      return `I'd be happy to help you create a budget template! 

For a feature film, I recommend starting with these categories:
• Above the Line (Director, Producer, Cast)
• Production (Equipment, Location, Props)
• Post-Production (Editing, VFX, Sound)
• Other (Insurance, Legal, Marketing)
• Contingency (Emergency Fund)

Would you like me to create a detailed template for your specific project type?`
    }
    
    if (lowerInput.includes('analyze') || lowerInput.includes('report')) {
      return `I can help you analyze your budget! 

To provide the best analysis, I'll need to know:
• Your total budget vs. actual spending
• Which categories are over/under budget
• Your project timeline and scope

Would you like me to analyze your current budget data?`
    }
    
    if (lowerInput.includes('recommend') || lowerInput.includes('advice')) {
      return `Here are some general movie budgeting recommendations:

1. **Always include a contingency fund** (10-15% of total budget)
2. **Track actual vs. budgeted amounts** regularly
3. **Break down large expenses** into smaller, manageable items
4. **Consider post-production costs** early in planning
5. **Plan for unexpected expenses** in each category

What specific aspect would you like advice on?`
    }
    
    return `I understand you're asking about "${userInput}". 

As a movie budgeting assistant, I can help you with:
• Creating budget templates
• Analyzing spending patterns
• Providing industry recommendations
• Organizing categories and subcategories
• Tracking variances and trends

What specific aspect of movie budgeting would you like to explore?`
  }

  // Set the model to use
  setModel(model: string): void {
    this.model = model
  }

  // Set the base URL for Ollama
  setBaseUrl(url: string): void {
    this.baseUrl = url
  }
}

// Export singleton instance
export const ollamaService = new OllamaService()

// Export the class for testing
export { OllamaService } 