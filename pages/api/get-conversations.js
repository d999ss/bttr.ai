import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const logsDir = path.join(process.cwd(), 'conversation-logs')
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      return res.status(200).json({ 
        conversations: [], 
        analytics: {
          totalConversations: 0,
          todaysConversations: 0,
          averageLength: 0,
          longConversations: 0
        }
      })
    }

    // Read all conversation log files
    const files = fs.readdirSync(logsDir)
    const conversationFiles = files.filter(file => file.startsWith('conversations-') && file.endsWith('.jsonl'))
    
    let allConversations = []

    // Parse all daily log files
    for (const file of conversationFiles) {
      const filePath = path.join(logsDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.trim().split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        try {
          const conversation = JSON.parse(line)
          allConversations.push(conversation)
        } catch (parseError) {
          console.error(`Error parsing line in ${file}:`, parseError)
        }
      }
    }

    // Remove duplicates (keep the latest version of each session)
    const conversationMap = new Map()
    allConversations.forEach(conv => {
      const existing = conversationMap.get(conv.sessionId)
      if (!existing || new Date(conv.timestamp) > new Date(existing.timestamp)) {
        conversationMap.set(conv.sessionId, conv)
      }
    })

    const uniqueConversations = Array.from(conversationMap.values())

    // Calculate analytics
    const now = new Date()
    const today = now.toDateString()
    
    const analytics = {
      totalConversations: uniqueConversations.length,
      todaysConversations: uniqueConversations.filter(conv => 
        new Date(conv.timestamp).toDateString() === today
      ).length,
      averageLength: uniqueConversations.length > 0 
        ? Math.round(uniqueConversations.reduce((sum, conv) => sum + conv.conversationLength, 0) / uniqueConversations.length)
        : 0,
      longConversations: uniqueConversations.filter(conv => conv.conversationLength >= 5).length,
      
      // Additional analytics
      thisWeekConversations: uniqueConversations.filter(conv => {
        const convDate = new Date(conv.timestamp)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return convDate > weekAgo
      }).length,
      
      topConversationStarters: getTopConversationStarters(uniqueConversations),
      averageSessionDuration: getAverageSessionDuration(uniqueConversations),
      conversionFunnelStats: getConversionStats(uniqueConversations)
    }

    // Sort conversations by most recent first
    uniqueConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.status(200).json({
      conversations: uniqueConversations,
      analytics
    })

  } catch (error) {
    console.error('Error retrieving conversations:', error)
    res.status(500).json({ 
      error: 'Failed to retrieve conversations',
      details: error.message 
    })
  }
}

function getTopConversationStarters(conversations) {
  const starters = {}
  conversations.forEach(conv => {
    if (conv.messages && conv.messages.length > 0) {
      const firstUserMessage = conv.messages.find(msg => msg.role === 'user')
      if (firstUserMessage) {
        const content = firstUserMessage.content.substring(0, 100) // First 100 chars
        starters[content] = (starters[content] || 0) + 1
      }
    }
  })
  
  return Object.entries(starters)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([starter, count]) => ({ starter, count }))
}

function getAverageSessionDuration(conversations) {
  const durationsInMinutes = conversations
    .map(conv => {
      if (conv.messages && conv.messages.length >= 2) {
        const start = new Date(conv.conversationStarted || conv.timestamp)
        const end = new Date(conv.conversationEnded || conv.timestamp)
        return (end - start) / (1000 * 60) // Convert to minutes
      }
      return 0
    })
    .filter(duration => duration > 0)
  
  return durationsInMinutes.length > 0
    ? Math.round(durationsInMinutes.reduce((sum, duration) => sum + duration, 0) / durationsInMinutes.length)
    : 0
}

function getConversionStats(conversations) {
  const stats = {
    totalVisitors: conversations.length,
    engagedUsers: conversations.filter(conv => conv.conversationLength >= 3).length,
    deepEngagement: conversations.filter(conv => conv.conversationLength >= 5).length,
    contactRequests: 0,
    portfolioRequests: 0
  }

  // Analyze conversation content for conversion indicators
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