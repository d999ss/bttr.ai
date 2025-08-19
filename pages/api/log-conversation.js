import { ConversationStorage } from '../../lib/conversation-storage'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sessionId, messages, metadata } = req.body
    
    // Create conversation log entry
    const conversationLog = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString()
      })),
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        referer: req.headers['referer'],
        ...metadata
      },
      conversationLength: messages.filter(msg => msg.role === 'user').length,
      lastUserMessage: messages.filter(msg => msg.role === 'user').slice(-1)[0]?.content,
      conversationStarted: metadata?.conversationStarted || new Date().toISOString(),
      conversationEnded: new Date().toISOString()
    }

    // Save using the new storage system
    const result = await ConversationStorage.saveConversation(sessionId, conversationLog)

    if (result.success) {
      // Send email notification for qualified conversations
      const userMessages = messages.filter(msg => msg.role === 'user')
      const shouldSendEmail = (
        userMessages.length >= 3 || // 3+ user messages
        metadata?.conversationComplete || // Marked as complete
        conversationLog.lastUserMessage?.toLowerCase().includes('contact') || // Contact intent
        conversationLog.lastUserMessage?.toLowerCase().includes('email')
      )

      if (shouldSendEmail) {
        try {
          // Send email notification asynchronously
          fetch(`${req.headers.origin || 'https://bttr-ai.com'}/api/send-conversation-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sessionId,
              conversation: conversationLog,
              analytics: {
                userMessageCount: userMessages.length,
                totalMessages: messages.length,
                hasContactIntent: conversationLog.lastUserMessage?.toLowerCase().includes('contact') || conversationLog.lastUserMessage?.toLowerCase().includes('email')
              }
            })
          }).catch(emailError => {
            console.error('Email notification failed:', emailError)
          })
        } catch (emailError) {
          console.error('Error triggering email notification:', emailError)
        }
      }

      res.status(200).json({ 
        success: true, 
        message: 'Conversation logged successfully',
        sessionId,
        emailSent: shouldSendEmail
      })
    } else {
      res.status(500).json({ 
        error: 'Failed to log conversation',
        details: result.error 
      })
    }

  } catch (error) {
    console.error('Error logging conversation:', error)
    res.status(500).json({ 
      error: 'Failed to log conversation',
      details: error.message 
    })
  }
}