import fs from 'fs'
import path from 'path'

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

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'conversation-logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Create filename with date for easy organization
    const date = new Date().toISOString().split('T')[0]
    const logFile = path.join(logsDir, `conversations-${date}.jsonl`)
    
    // Append to daily log file (JSONL format for easy parsing)
    const logLine = JSON.stringify(conversationLog) + '\n'
    fs.appendFileSync(logFile, logLine)

    // Also save individual conversation file for detailed analysis
    const conversationFile = path.join(logsDir, `conversation-${sessionId}.json`)
    fs.writeFileSync(conversationFile, JSON.stringify(conversationLog, null, 2))

    res.status(200).json({ 
      success: true, 
      message: 'Conversation logged successfully',
      sessionId 
    })

  } catch (error) {
    console.error('Error logging conversation:', error)
    res.status(500).json({ 
      error: 'Failed to log conversation',
      details: error.message 
    })
  }
}