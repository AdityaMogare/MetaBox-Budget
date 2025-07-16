import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useBudget } from '../contexts/BudgetContext'
import { ollamaService } from '../services/ollamaService'

// Simple markdown renderer fallback
const MarkdownRenderer: React.FC<{ children: string }> = ({ children }) => {
  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•\s*(.*)/g, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatMarkdown(children) }}
    />
  )
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface BudgetTemplate {
  name: string
  description: string
  items: Array<{
    category: string
    subcategory: string
    description: string
    amount: number
  }>
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `🎬 **Welcome to Movie Magic Budgeting AI!**

I'm here to help you with your movie budgeting needs. I can:

• **Create budget templates** for different types of projects
• **Analyze your current budget** and provide recommendations
• **Suggest optimizations** based on industry standards
• **Help with category organization** and expense tracking
• **Generate reports** and insights

What would you like to work on today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { state, dispatch } = useBudget()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBudgetTemplate = (projectType: string): BudgetTemplate => {
    const templates: Record<string, BudgetTemplate> = {
      'feature-film': {
        name: 'Feature Film Budget Template',
        description: 'Standard template for a feature film production',
        items: [
          { category: 'Above the Line', subcategory: 'Director', description: 'Director Fee', amount: 150000 },
          { category: 'Above the Line', subcategory: 'Producer', description: 'Producer Fee', amount: 100000 },
          { category: 'Above the Line', subcategory: 'Cast', description: 'Lead Actor', amount: 500000 },
          { category: 'Production', subcategory: 'Equipment', description: 'Camera Package', amount: 75000 },
          { category: 'Production', subcategory: 'Location', description: 'Location Fees', amount: 50000 },
          { category: 'Post-Production', subcategory: 'Editing', description: 'Editor Fee', amount: 60000 },
          { category: 'Post-Production', subcategory: 'Visual Effects', description: 'VFX Budget', amount: 100000 },
          { category: 'Other', subcategory: 'Insurance', description: 'Production Insurance', amount: 25000 },
          { category: 'Contingency', subcategory: 'Emergency Fund', description: 'Contingency Fund', amount: 100000 }
        ]
      },
      'short-film': {
        name: 'Short Film Budget Template',
        description: 'Template for short film production',
        items: [
          { category: 'Above the Line', subcategory: 'Director', description: 'Director Fee', amount: 5000 },
          { category: 'Production', subcategory: 'Equipment', description: 'Camera Rental', amount: 2000 },
          { category: 'Production', subcategory: 'Location', description: 'Location Fees', amount: 1000 },
          { category: 'Post-Production', subcategory: 'Editing', description: 'Editor Fee', amount: 3000 },
          { category: 'Other', subcategory: 'Marketing', description: 'Festival Submissions', amount: 500 }
        ]
      },
      'documentary': {
        name: 'Documentary Budget Template',
        description: 'Template for documentary production',
        items: [
          { category: 'Above the Line', subcategory: 'Director', description: 'Director Fee', amount: 30000 },
          { category: 'Production', subcategory: 'Equipment', description: 'Camera & Sound Equipment', amount: 15000 },
          { category: 'Production', subcategory: 'Transportation', description: 'Travel Expenses', amount: 10000 },
          { category: 'Post-Production', subcategory: 'Editing', description: 'Editor Fee', amount: 25000 },
          { category: 'Other', subcategory: 'Legal', description: 'Clearance & Rights', amount: 5000 }
        ]
      }
    }
    return templates[projectType] || templates['feature-film']
  }

  const applyTemplate = (template: BudgetTemplate) => {
    template.items.forEach(item => {
      const newItem = {
        id: Date.now().toString() + Math.random(),
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
        amount: item.amount,
        actual: 0,
        variance: -item.amount,
        notes: `Template item from ${template.name}`,
        date: new Date().toISOString().split('T')[0]
      }
      dispatch({ type: 'ADD_ITEM', payload: newItem })
    })
  }

  const analyzeBudget = () => {
    const totalBudget = state.totalBudget
    const totalActual = state.totalActual
    const variance = state.totalVariance
    const utilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0

    let analysis = `📊 **Budget Analysis Report**\n\n`
    analysis += `**Total Budget:** $${totalBudget.toLocaleString()}\n`
    analysis += `**Total Spent:** $${totalActual.toLocaleString()}\n`
    analysis += `**Variance:** $${Math.abs(variance).toLocaleString()} ${variance >= 0 ? '(Over Budget)' : '(Under Budget)'}\n`
    analysis += `**Utilization:** ${utilization.toFixed(1)}%\n\n`

    if (variance > 0) {
      analysis += `⚠️ **Budget Overrun Alert**\n`
      analysis += `Your project is over budget by $${variance.toLocaleString()}. Consider:\n`
      analysis += `• Reviewing high-variance items\n`
      analysis += `• Adjusting spending in remaining categories\n`
      analysis += `• Reallocating funds from under-budget areas\n\n`
    } else if (variance < 0) {
      analysis += `✅ **Budget Status: Good**\n`
      analysis += `You're under budget by $${Math.abs(variance).toLocaleString()}. You may have room for:\n`
      analysis += `• Additional expenses\n`
      analysis += `• Quality improvements\n`
      analysis += `• Contingency allocation\n\n`
    }

    const categoryBreakdown = state.categories.map(category => {
      const items = state.items.filter(item => item.category === category)
      const budget = items.reduce((sum, item) => sum + item.amount, 0)
      const actual = items.reduce((sum, item) => sum + item.actual, 0)
      return { category, budget, actual, variance: actual - budget }
    }).filter(item => item.budget > 0)

    if (categoryBreakdown.length > 0) {
      analysis += `**Category Breakdown:**\n`
      categoryBreakdown.forEach(item => {
        analysis += `• ${item.category}: $${item.budget.toLocaleString()} budget, $${item.actual.toLocaleString()} spent\n`
      })
    }

    return analysis
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response = ''

      // Check if this is a template or analysis request
      if (input.toLowerCase().includes('template') || input.toLowerCase().includes('create')) {
        const projectType = input.toLowerCase().includes('short') ? 'short-film' : 
                           input.toLowerCase().includes('documentary') ? 'documentary' : 'feature-film'
        const template = generateBudgetTemplate(projectType)
        
        response = `📋 **${template.name}**\n\n`
        response += `${template.description}\n\n`
        response += `**Template Items:**\n`
        template.items.forEach(item => {
          response += `• ${item.category} > ${item.subcategory}: ${item.description} - $${item.amount.toLocaleString()}\n`
        })
        response += `\nWould you like me to apply this template to your budget?`
        
        // Store template for potential application
        localStorage.setItem('currentTemplate', JSON.stringify(template))
      } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('report')) {
        response = analyzeBudget()
      } else if (input.toLowerCase().includes('apply') || input.toLowerCase().includes('use template')) {
        const templateData = localStorage.getItem('currentTemplate')
        if (templateData) {
          const template = JSON.parse(templateData)
          applyTemplate(template)
          response = `✅ **Template Applied Successfully!**\n\n`
          response += `I've added ${template.items.length} budget items to your project. `
          response += `You can now review and adjust them in the Budget section.`
          localStorage.removeItem('currentTemplate')
        } else {
          response = `❌ No template available to apply. Please create a template first.`
        }
      } else {
        // Use Ollama for general responses
        response = await ollamaService.generateResponse(input)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble processing your request right now. Please try again or ask me something else about movie budgeting.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Bot className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Budget Assistant</h3>
            <p className="text-sm text-gray-500">Powered by Movie Magic AI</p>
          </div>
        </div>
        <div className="ml-auto">
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-primary-600" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <MarkdownRenderer>
                  {message.content}
                </MarkdownRenderer>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  <span className="text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about budget templates, analysis, or recommendations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('Create a feature film budget template')}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            🎬 Feature Film Template
          </button>
          <button
            onClick={() => setInput('Create a short film budget template')}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            📹 Short Film Template
          </button>
          <button
            onClick={() => setInput('Analyze my current budget')}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            📊 Budget Analysis
          </button>
          <button
            onClick={() => setInput('What categories should I use?')}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            ❓ Get Help
          </button>
        </div>
      </div>
    </div>
  )
} 