const fs = require('fs');
const path = require('path');

// Read the pitch templates
const davidAireyPitch = fs.readFileSync(path.join(__dirname, 'outreach-templates/david-airey-pitch.md'), 'utf8');
const dielinePitch = fs.readFileSync(path.join(__dirname, 'outreach-templates/dieline-pitch.md'), 'utf8');

// Extract email content from markdown
function extractEmailContent(markdown) {
  const subjectMatch = markdown.match(/\*\*Subject:\*\* (.+)/);
  const toMatch = markdown.match(/\*\*To:\*\* (.+)/);
  const bodyMatch = markdown.match(/---\n\n([\s\S]+)$/);
  
  return {
    subject: subjectMatch ? subjectMatch[1] : '',
    to: toMatch ? toMatch[1] : '',
    body: bodyMatch ? bodyMatch[1] : ''
  };
}

// Send outreach emails
async function sendOutreachEmails() {
  const emails = [
    extractEmailContent(davidAireyPitch),
    extractEmailContent(dielinePitch)
  ];

  console.log('Starting outreach campaign...\n');

  for (const email of emails) {
    try {
      console.log(`Sending to: ${email.to}`);
      console.log(`Subject: ${email.subject}\n`);
      
      const response = await fetch('http://localhost:3000/api/send-outreach-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.to,
          subject: email.subject,
          body: email.body,
          from: 'Donny Smith <hello@makebttr.com>'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Successfully sent to ${email.to}`);
        console.log(`Message ID: ${result.messageId}\n`);
        
        // Update tracking file
        updateTrackingFile(email.to);
      } else {
        console.log(`❌ Failed to send to ${email.to}: ${result.error}\n`);
      }
      
      // Wait 2 seconds between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error sending to ${email.to}:`, error.message);
    }
  }
  
  console.log('Outreach campaign complete!');
}

// Update the tracking CSV file
function updateTrackingFile(email) {
  const trackingFile = path.join(__dirname, 'outreach-tracker.csv');
  let content = fs.readFileSync(trackingFile, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  const followUpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Update status from "Ready to Send" to "Contacted"
  content = content.replace(
    new RegExp(`(${email},[^,]+,)Ready to Send(,)(,)(,)`),
    `$1Contacted$2${today}$3${followUpDate}$4`
  );
  
  fs.writeFileSync(trackingFile, content);
  console.log(`Updated tracking for ${email}`);
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
  // Only run if we have the required environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.log('\nPlease add to your .env.local file:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASS=your-app-specific-password\n');
    console.log('For Gmail, create an app-specific password at:');
    console.log('https://myaccount.google.com/apppasswords\n');
  } else {
    sendOutreachEmails().catch(console.error);
  }
}

module.exports = { sendOutreachEmails };