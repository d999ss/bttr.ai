import { initDatabase } from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await initDatabase()
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Database initialized successfully' 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      })
    }
  } catch (error) {
    console.error('Error initializing database:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}