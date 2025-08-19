// Simple in-memory storage with localStorage fallback for conversation tracking
// This works better with Vercel's serverless environment

let conversationStore = new Map()

export class ConversationStorage {
  static conversations = new Map()
  
  static async saveConversation(sessionId, conversationData) {
    try {
      // Store in memory
      this.conversations.set(sessionId, {
        ...conversationData,
        lastUpdated: new Date().toISOString()
      })
      
      // For development, also log to console so we can see it's working
      console.log(`Conversation saved: ${sessionId}`, conversationData)
      
      return { success: true, sessionId }
    } catch (error) {
      console.error('Error saving conversation:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async getConversations() {
    try {
      const conversations = Array.from(this.conversations.values())
      
      // Calculate analytics
      const now = new Date()
      const today = now.toDateString()
      
      const analytics = {
        totalConversations: conversations.length,
        todaysConversations: conversations.filter(conv => 
          new Date(conv.timestamp).toDateString() === today
        ).length,
        averageLength: conversations.length > 0 
          ? Math.round(conversations.reduce((sum, conv) => sum + conv.conversationLength, 0) / conversations.length)
          : 0,
        longConversations: conversations.filter(conv => conv.conversationLength >= 5).length,
        
        thisWeekConversations: conversations.filter(conv => {
          const convDate = new Date(conv.timestamp)
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return convDate > weekAgo
        }).length,
        
        topConversationStarters: this.getTopConversationStarters(conversations),
        averageSessionDuration: this.getAverageSessionDuration(conversations),
        conversionFunnelStats: this.getConversionStats(conversations)
      }
      
      return {
        conversations: conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        analytics
      }
    } catch (error) {
      console.error('Error getting conversations:', error)
      return { 
        conversations: [], 
        analytics: {
          totalConversations: 0,
          todaysConversations: 0,
          averageLength: 0,
          longConversations: 0
        }
      }
    }
  }
  
  static getTopConversationStarters(conversations) {
    const starters = {}
    conversations.forEach(conv => {
      if (conv.messages && conv.messages.length > 0) {
        const firstUserMessage = conv.messages.find(msg => msg.role === 'user')
        if (firstUserMessage) {
          const content = firstUserMessage.content.substring(0, 100)
          starters[content] = (starters[content] || 0) + 1
        }
      }
    })
    
    return Object.entries(starters)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([starter, count]) => ({ starter, count }))
  }
  
  static getAverageSessionDuration(conversations) {
    const durationsInMinutes = conversations
      .map(conv => {
        if (conv.messages && conv.messages.length >= 2) {
          const start = new Date(conv.conversationStarted || conv.timestamp)
          const end = new Date(conv.conversationEnded || conv.timestamp)
          return (end - start) / (1000 * 60)
        }
        return 0
      })
      .filter(duration => duration > 0)
    
    return durationsInMinutes.length > 0
      ? Math.round(durationsInMinutes.reduce((sum, duration) => sum + duration, 0) / durationsInMinutes.length)
      : 0
  }
  
  static getConversionStats(conversations) {
    const stats = {
      totalVisitors: conversations.length,
      engagedUsers: conversations.filter(conv => conv.conversationLength >= 3).length,
      deepEngagement: conversations.filter(conv => conv.conversationLength >= 5).length,
      contactRequests: 0,
      portfolioRequests: 0
    }

    conversations.forEach(conv => {
      const allContent = conv.messages
        .map(msg => msg.content.toLowerCase())
        .join(' ')
      
      if (allContent.includes('contact') || allContent.includes('email') || allContent.includes('hello@makebttr.com')) {
        stats.contactRequests++
      }
      
      if (allContent.includes('portfolio') || allContent.includes('work') || allContent.includes('makebttr.com/work')) {
        stats.portfolioRequests++
      }
    })

    return stats
  }
}