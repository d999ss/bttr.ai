import twilio from 'twilio'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userMessage } = req.body
    
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    const smsMessage = await client.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: process.env.MY_PHONE_NUMBER,
      body: `🤖 New chat on bttr-ai.com\n\nUser: ${userMessage}\n\nTime: ${new Date().toLocaleString()}`
    })

    return res.status(200).json({ 
      success: true, 
      sid: smsMessage.sid 
    })

  } catch (error) {
    console.error('SMS Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}