import { ConversationStorage } from '../../lib/conversation-storage'
import { getConversations as getFromDatabase } from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    let result;
    
    // Try to get from database first (if configured)
    if (process.env.POSTGRES_URL) {
      result = await getFromDatabase()
    } else {
      // Fall back to in-memory storage
      result = await ConversationStorage.getConversations()
    }
    
    res.status(200).json(result)
  } catch (error) {
    console.error('Error retrieving conversations:', error)
    res.status(500).json({ 
      error: 'Failed to retrieve conversations',
      details: error.message 
    })
  }
}