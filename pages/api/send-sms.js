import twilio from 'twilio'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if SMS is properly configured
  if (!process.env.TWILIO_ACCOUNT_SID || 
      !process.env.TWILIO_AUTH_TOKEN || 
      !process.env.TWILIO_MESSAGING_SERVICE_SID || 
      !process.env.MY_PHONE_NUMBER) {
    // SMS not configured - return success anyway
    return res.status(200).json({ 
      success: true, 
      message: 'SMS notifications not configured' 
    })
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
    // Log error but don't expose details to client
    console.error('SMS Error (non-critical):', error.message)
    return res.status(200).json({ 
      success: false, 
      message: 'SMS notification skipped' 
    })
  }
}