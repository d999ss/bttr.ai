import { ConversationStorage } from '../../lib/conversation-storage'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await ConversationStorage.getConversations()
    res.status(200).json(result)
  } catch (error) {
    console.error('Error retrieving conversations:', error)
    res.status(500).json({ 
      error: 'Failed to retrieve conversations',
      details: error.message 
    })
  }
}