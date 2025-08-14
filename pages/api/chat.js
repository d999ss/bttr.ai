export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    // Add small delay to show thinking
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const response = `$ echo "${userMessage}"
${userMessage}

$ whoami
Donny Smith - Chief Creative Officer at Bttr

$ cat ~/company.txt
Bttr. A Brand & Digital Experience Company
Helping ambitious teams design a better future.
www.makebttr.com

$ ls -la services/
drwxr-xr-x  brand-strategy/
drwxr-xr-x  digital-experiences/  
drwxr-xr-x  creative-direction/
drwxr-xr-x  team-consulting/

What ambitious project can we help you build?`

    // Stream with proper format for useChat
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the response as chunks
        const chunks = response.split(' ')
        chunks.forEach((chunk, index) => {
          controller.enqueue(encoder.encode(chunk + (index < chunks.length - 1 ? ' ' : '')))
        })
        controller.close()
      }
    })

    // Simple approach - just write the response
    res.write(response)
    res.end()
    
  } catch (error) {
    console.error('Chat error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: error.message })
    }
  }
}