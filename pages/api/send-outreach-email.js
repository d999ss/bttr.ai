import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, from } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'hello@makebttr.com',
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: from || process.env.EMAIL_USER || 'hello@makebttr.com',
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Outreach email sent:', {
      to,
      subject,
      messageId: info.messageId
    });

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      to,
      subject
    });
  } catch (error) {
    console.error('Error sending outreach email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}