import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { BTTR_CONTEXT } from '../../lib/bttr-context'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { messages, sessionContext } = await req.json()
  
  // Check if this is the user's first real message (not the welcome message)
  const userMessages = messages.filter(msg => msg.role === 'user')
  const isFirstUserMessage = userMessages.length === 1
  
  if (isFirstUserMessage && process.env.ENABLE_SMS_NOTIFICATIONS === 'true') {
    // Send SMS notification for first user interaction (optional)
    try {
      const baseUrl = req.url.includes('localhost') ? 'http://localhost:3001' : 'https://bttr-ai.com'
      fetch(`${baseUrl}/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessages[0].content
        })
      }).catch(() => {
        // Silently fail SMS sending - non-critical feature
      })
    } catch (error) {
      // Don't fail the chat if SMS setup fails
    }
  }
  
  // Check if user is asking for image generation
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && 
      (lastMessage.content.toLowerCase().includes('create image') ||
       lastMessage.content.toLowerCase().includes('generate image') ||
       lastMessage.content.toLowerCase().includes('make image') ||
       lastMessage.content.toLowerCase().includes('draw') ||
       lastMessage.content.toLowerCase().includes('design') ||
       lastMessage.content.toLowerCase().includes('visualize'))) {
    
    try {
      const baseUrl = req.url.includes('localhost') ? 'http://localhost:3000' : 'https://bttr-ai.com'
      const imageResponse = await fetch(`${baseUrl}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: lastMessage.content
        })
      })
      
      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        const imageMarkdown = `![Generated Image](${imageData.imageUrl})\n\n*Generated with DALL-E 3*`
        
        return new Response(imageMarkdown, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      }
    } catch (error) {
      console.error('Image generation error:', error)
      // Fall through to regular chat if image generation fails
    }
  }


  // Check if the last message is a command or special trigger
  if (lastMessage?.content?.startsWith('/') || lastMessage?.content?.toLowerCase().trim() === 'snake') {
    const command = lastMessage.content.startsWith('/') ? lastMessage.content : 'snake'
    const commandResponses = {
      'snake': `$ starting snake.exe...
    
🐍 SNAKE GAME ACTIVATED 🐍

Controls: Arrow keys or WASD
Goal: Eat the 🍎 to grow
Don't hit the walls or yourself!

╔════════════════════════╗
║                        ║
║    🐍       🍎         ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
╚════════════════════════╝

Score: 0    High Score: --

Press SPACE to start!

$ Type 'exit' to quit snake and return to terminal`,
      '/portfolio': `$ ls -la ~/portfolio/
drwxr-xr-x  Ikon Pass App - Complete redesign serving millions of skiers
drwxr-xr-x  GE Vernova GridOS - AI-powered energy grid modernization
drwxr-xr-x  Air Company - Sustainability brand transformation
drwxr-xr-x  GE Aerospace - Enterprise UI innovation
drwxr-xr-x  Allergan Aesthetics - Medical practice experiences

$ open makebttr.com/work
→ View full portfolio at makebttr.com`,

      '/contact': `**Let's build together**

We partner with leaders and teams to turn ambitious ideas into exceptional digital products. From defining the vision to designing the experience to launching at scale — every step is intentional, fast, and built for impact.

[hello@makebttr.com](mailto:hello@makebttr.com)

[makebttr.com](https://makebttr.com)`,

      '/philosophy': `$ cat ~/philosophy.md
# Design Philosophy

"An object in motion stays in motion."

## Core Principles:
- Clarity, precision, and emotional resonance create lasting impact
- Every product should feel inevitable in hindsight
- First-principles thinking: Strip down to core truths
- High-craft execution: Every pixel is deliberate
- Story-first design: Products must communicate narratives people care about

## Our Approach
Calm confidence in future success, paired with obsession for excellence.
Building as if the win is already inevitable.`,

      '/clients': `$ grep -r "client" ~/projects/
GE Aerospace - Aviation & defense systems
GE Vernova - Renewable energy transformation
Pepsi - Global beverage innovation
Allergan Aesthetics - Medical aesthetics
Alterra Mountain Company - Ikon Pass platform
Air Company - Carbon transformation technology

$ wc -l ~/clients/fortune500.txt
12 Fortune 500 companies served`,

      '/catalyst': `![Catalyst Program Hero](https://www.makebttr.com/content/uploads/2025/08/01-1.png)

🚀 **The Catalyst Program**
Outthink uncertainty. Make 2026 your breakthrough year.

We've partnered with Tom Goodwin (#1 Voice in Marketing on LinkedIn) to help ambitious leaders define what's next through our innovation accelerator program.

![Innovation Workstreams](https://www.makebttr.com/content/uploads/2025/08/02.png)

**Four Innovation Workstreams:**
• Foundations & Future Vision
• Business Model Innovation  
• Product & Service Innovation
• Brand & Marketing Innovation

![Program Strategy](https://www.makebttr.com/content/uploads/2025/08/03.png)

![Tom Goodwin Partnership](https://www.makebttr.com/content/uploads/2025/08/05-1.png)

Each workstream delivers actionable insights, provocations, and blueprints to unlock growth opportunities.

Ready to explore what's possible? Let's discuss how the Catalyst Program can transform your business.

[Book a discovery call →](mailto:hello@makebttr.com?subject=Catalyst%20Program%20Inquiry)`,

      '/news': `📰 **Latest News & Insights**

**Opendoor appoint Bttr.** (Jul 2025)
We're partnering with Opendoor on their next phase of growth.

**AI Concept Car Brand** (Dec 2025)  
Pushing creative boundaries with AI-generated automotive design.

**Rebuilding Tomorrow** (Jan 2025)
Crafting the future with smarter tools and sustainable AI.

**Alterra Partnership** (Jun 2024)
Elevating digital design for millions of skiers worldwide.

**GE Vernova** (Sep 2023)
Presenting complex systems with clarity to inspire confidence.

→ Read more at [makebttr.com/news](https://www.makebttr.com/news/)`
    }
    
    if (commandResponses[command]) {
      // For snake and other commands, return directly without AI processing
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:"${commandResponses[command].replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`))
          controller.close()
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }
  }

  // Build contextual system prompt
  let contextualPrompt = `${BTTR_CONTEXT}

TODAY'S DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
CURRENT TIME: ${new Date().toLocaleTimeString('en-US')}

IMPORTANT INSTRUCTIONS:
- You are Bttr.'s AI team representative
- Speak as "we" representing the entire Bttr. team ("We built...", "We created...", "Our approach...")
- Maintain the terminal/command line aesthetic in responses when appropriate
- Be direct, confident, and concise
- No filler or fluff, speak with clarity and conviction
- Balance creative vision with business pragmatism
- Embody calm confidence in success with obsession for excellence
- When discussing work, reference specific projects and clients from the context
- Always align responses with the tone: decisive, structured, narrative-driven
- We can generate images using DALL-E when users ask us to "create", "design", "draw", or "visualize" something
- For contact requests, provide email: hello@makebttr.com
- When users ask for detailed project information, mention that full case studies with visuals are available at makebttr.com/work
- Direct all business inquiries to makebttr.com
- When users ask about innovation, transformation, or future planning, START your response with the Catalyst hero image, then explain the program:
  Start with: ![Catalyst Program](https://www.makebttr.com/content/uploads/2025/08/01-1.png)
  Then include relevant images throughout:
  • ![Innovation Workstreams](https://www.makebttr.com/content/uploads/2025/08/02.png)
  • ![Program Strategy](https://www.makebttr.com/content/uploads/2025/08/03.png)
  • ![Tom Goodwin](https://www.makebttr.com/content/uploads/2025/08/05-1.png)
- Emphasize that the Catalyst Program helps leaders "outthink uncertainty" and make 2026 a breakthrough year
- When users ask what's new or about recent work, reference our latest news and partnerships (Opendoor, AI car brand, etc.)`

  // Add session context insights
  if (sessionContext && Object.keys(sessionContext).length > 0) {
    contextualPrompt += `

SESSION CONTEXT:
- This visitor has been engaged for ${sessionContext.total_messages || 0} messages`
    
    if (sessionContext.interested_in_design) {
      contextualPrompt += `
- They've shown interest in design work - emphasize visual projects like Ikon Pass, Air Company branding`
    }
    
    if (sessionContext.interested_in_strategy) {
      contextualPrompt += `
- They're interested in business strategy - highlight market positioning work and growth outcomes`
    }
    
    if (sessionContext.interested_in_technology) {
      contextualPrompt += `
- They have technical interests - mention system architecture, AI tools, and technical implementation`
    }
    
    if (sessionContext.interested_in_projects) {
      contextualPrompt += `
- They've asked about specific projects - provide deeper insights and case study details`
    }
    
    if (sessionContext.interested_in_contact) {
      contextualPrompt += `
- They're interested in working together - be more direct about next steps and collaboration`
    }
    
    if (sessionContext.total_messages > 3) {
      contextualPrompt += `
- This is a deeper conversation - you can be more specific and skip basic introductions`
    }
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: contextualPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}