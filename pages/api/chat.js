import { createOpenAI } from '@ai-sdk/openai'
import { streamText, generateText } from 'ai'
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

  const { messages, sessionContext, stream } = await req.json()
  
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

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://calendly.com/bttr/catalyst-discovery', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book Discovery Call</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Catalyst%20Program%20Inquiry', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">✉️ Email Us</button>
<button onclick="window.selectSuggestion('Tell me more about the program timeline')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⏱️ Program Timeline</button>
<button onclick="window.selectSuggestion('What companies have you worked with?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🏢 See Client List</button>
</div>`,

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

  // Handle conversation starters with high-converting responses
  if (lastMessage?.content) {
    const conversationStarters = {
      "I'm trying to launch a new brand": `**Launching a new brand? Perfect timing.**

We've built brands from the ground up for companies like Air Company (carbon technology), Revaire (luxury lifestyle), and Helix (spanning three sectors).

Here's how we approach brand launches that actually matter:

**→ Strategic Foundation First**
Most brands fail because they skip the hard questions. We start with positioning: Who are you really for? What category are you creating or disrupting?

**→ Visual Identity That Works Everywhere**
Your logo on a business card is table stakes. We design systems that scale across touchpoints you haven't even thought of yet.

**→ Story-First Approach**
Every brand needs a narrative people care about. We don't just design pretty logos—we craft the story that makes people choose you.

**Recent Brand Launch: Air Company**
We transformed a carbon technology startup into a luxury lifestyle brand. The challenge? Making "CO2 conversion" feel aspirational, not academic.

Result: Premium positioning in spirits, fragrance, and lifestyle categories with global retail partnerships.

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">🎯 See Brand Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Brand%20Launch%20Inquiry', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">💌 Start Conversation</button>
<button onclick="window.selectSuggestion('What does a typical brand project timeline look like?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⏱️ Typical Timeline</button>
</div>

What kind of brand are you launching? What category are you trying to disrupt?`,

      "I need to build growth mechanics into the product": `**Growth mechanics aren't features—they're strategy.**

We've built growth into products used by millions: Ikon Pass (serving millions of skiers), Allē loyalty program (2M+ active users), and GE platforms (300K+ employees).

Here's how we think about sustainable product growth:

**→ User Psychology First**
Growth mechanics fail when they feel forced. We design systems that align user value with business value—so growth feels natural, not manipulative.

**→ Data-Driven Personalization**
Our Allē loyalty program increased engagement 3x through gamified rewards that adapt to individual user behavior patterns.

**→ Viral Coefficient Integration**
The best growth mechanics make sharing inevitable. We build referral systems, social proof, and network effects directly into core user flows.

**Real Example: Ikon Pass App**
We didn't just redesign the interface—we built growth into the experience:
- Social features that make skiing more connected
- Dynamic pricing that rewards early adopters
- Personalization that improves with usage

Result: App Store rating jumped from 2.1 to 4.6 stars, driving significant user acquisition.

**The Growth Stack We Build:**
• Onboarding that retains (not just converts)
• Engagement loops that compound
• Sharing mechanics that feel natural
• Data collection that improves experience

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📱 See Product Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Product%20Growth%20Strategy', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🚀 Discuss Growth</button>
<button onclick="window.selectSuggestion('How do you measure growth mechanism success?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📊 Success Metrics</button>
</div>

What's your current user acquisition cost? What growth challenges are you facing?`,

      "Align teams for smooth product launches": `**Team alignment makes or breaks launches.**

We've orchestrated complex launches across Fortune 500 companies: GE Aerospace, PepsiCo, Allergan Aesthetics. The secret isn't better project management—it's better design systems.

**The Alignment Problem:**
• Design creates beautiful mockups
• Engineering builds different interpretations  
• Product changes requirements mid-flight
• Marketing promises features that don't exist
• Leadership sees none of it until it's too late

**Our Solution: Design Systems as Team Language**

We don't just create component libraries. We build shared languages that align everyone from day one.

**Real Example: GE Healthcare System**
We built a comprehensive design system spanning medical AI applications across imaging, diagnostics, and patient monitoring.

Challenge: 12 product teams, 50+ engineers, multiple regulatory requirements.

Our approach:
• **Shared Component Library**: One source of truth for all teams
• **Design Tokens**: Consistent spacing, colors, typography across platforms  
• **Documentation That Works**: Every component has usage guidelines, code examples, and accessibility notes
• **Stakeholder Workshops**: We train teams to use the system effectively

Result: 60% faster development cycles, consistent user experience, seamless cross-product integration.

**What We Deliver for Launch Alignment:**
→ Design systems that scale with your team
→ Documentation that engineering actually uses
→ Component libraries that reduce development time
→ Stakeholder alignment workshops
→ Launch readiness audits

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">🛠️ See System Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Team%20Alignment%20Strategy', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🎯 Get Aligned</button>
<button onclick="window.selectSuggestion('How long does it take to build a design system?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⏳ Timeline & Process</button>
</div>

How many teams are involved in your launches? What's causing the biggest alignment issues?`,

      "Turn customer feedback into product updates": `**Feedback without action is just noise.**

We've built feedback systems that actually drive product evolution: Allē (2M+ users), Ikon Pass (millions of skiers), GE platforms (300K+ employees).

The problem isn't collecting feedback—it's turning insights into better products.

**Our Feedback-to-Product System:**

**→ Smart Collection Points**
We design feedback collection directly into user flows where insights are most valuable—not annoying pop-ups that interrupt experience.

**→ Insight Synthesis**  
Raw feedback is chaos. We build systems that identify patterns, prioritize issues, and surface actionable insights automatically.

**→ Rapid Iteration Cycles**
The best feedback systems enable immediate testing. We design for continuous improvement, not quarterly releases.

**Real Example: Ikon Pass Transformation**
When we took over the Ikon Pass app (rating: 2.1 stars), feedback was brutal but illuminating:

User complaints:
• "Impossible to find my pass"
• "Social features don't work"
• "Pricing makes no sense"
• "App crashes constantly"

Our approach:
• **In-App Feedback Loops**: Real-time user sentiment tracking
• **Behavioral Analytics**: Understanding what users actually do vs. what they say
• **A/B Testing Framework**: Every change validated with real user data
• **Personalization Engine**: Adapting experience based on individual usage patterns

Result: 2.1 → 4.6 stars, millions of satisfied users, significant revenue impact.

**What We Build:**
• Feedback collection that doesn't annoy users
• Analytics that reveal true user needs
• A/B testing frameworks for rapid validation
• Personalization engines that adapt to individual users
• Systems that turn insights into product improvements

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📊 See Analytics Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Feedback%20System%20Strategy', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🔄 Improve Feedback Loop</button>
<button onclick="window.selectSuggestion('What feedback collection methods work best?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📋 Collection Methods</button>
</div>

What kind of feedback are you getting? How are you currently acting on user insights?`,

      "Help me redesign our mobile experience": `**Mobile isn't just responsive—it's rethinking everything.**

We've redesigned mobile experiences that millions use daily: Ikon Pass, Allē loyalty program, Dollar Shave Club, and PepsiCo consumer touchpoints.

Mobile redesign isn't about making desktop smaller. It's about understanding mobile behavior completely.

**Mobile-First Thinking:**

**→ Thumb-Driven Navigation**
We design for how people actually hold phones. One-handed use isn't optional—it's primary behavior.

**→ Micro-Interactions That Delight**
Mobile users have zero patience for slow, confusing interfaces. Every tap should feel instant and intentional.

**→ Context-Aware Design**
Mobile users are distracted, moving, multitasking. We design for divided attention and interrupted usage.

**Real Example: Dollar Shave Club Mobile**
Challenge: Complex subscription management on tiny screens with high user expectations.

Our mobile-first approach:
• **Progressive Disclosure**: Show what matters now, everything else is one tap away
• **Smart Defaults**: Predictive interface that learns user preferences  
• **Offline-First**: Core functionality works without perfect connectivity
• **Gesture-Based Navigation**: Swipe, pull, pinch—mobile-native interactions

Result: 23% increase in mobile conversion rate, significantly reduced support tickets.

**Recent Success: Ikon Pass Mobile**
Transformed a 2.1-star app into 4.6-star experience:
• **Personalized Dashboard**: Different layouts for different skier types
• **Social Integration**: Share conditions, track friends, plan trips together
• **Dynamic Pricing**: Real-time lift ticket pricing with mobile-optimized purchase flow

**Our Mobile Strategy:**
→ User research focused on mobile context
→ Touch-optimized interface design
→ Performance optimization for any device
→ Progressive web app capabilities
→ Native app integration where needed

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📱 See Mobile Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Mobile%20Redesign%20Project', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🚀 Start Mobile Project</button>
<button onclick="window.selectSuggestion('What mobile metrics do you track for success?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📊 Mobile Success Metrics</button>
</div>

What's your current mobile conversion rate? What's frustrating your mobile users most?`,

      "We need a complete brand refresh": `**Brand refresh is about evolution, not revolution.**

We've refreshed brands at every stage: from startups finding their voice (Air Company, Revaire) to Fortune 500 giants staying relevant (GE, PepsiCo, Allergan).

The key isn't throwing everything away—it's understanding what still works and what needs to evolve.

**Our Brand Refresh Strategy:**

**→ Brand Archaeology First**
We dig deep into your brand's history. What equity exists? What perceptions are you fighting? What promises haven't you kept?

**→ Future-Proofing, Not Trend-Chasing**  
Refreshes that chase current trends look dated quickly. We design for where your brand needs to be in 5 years, not 5 months.

**→ System Thinking**
Brand refresh touches everything: logo, typography, color, voice, photography style, packaging, digital presence. We ensure consistency across all touchpoints.

**Recent Success: Air Company**
Challenge: Transform a carbon technology startup from academic to aspirational.

The refresh challenge:
• Technical innovation ≠ consumer appeal
• "CO2 conversion" sounds complicated
• Premium positioning in crowded lifestyle market
• Global retail partnerships needed brand authority

Our approach:
• **Positioning**: From "carbon technology" to "carbon transformation"
• **Visual Identity**: Clean, premium aesthetic that whispers sustainability
• **Brand Voice**: Confident simplicity that makes complex science accessible
• **Packaging Design**: Luxury positioning without environmental guilt

Result: Premium shelf presence, global partnerships, consumer brand recognition in spirits, fragrance, and lifestyle categories.

**What We Deliver in Brand Refresh:**
→ Strategic positioning audit and recommendations
→ Complete visual identity system
→ Brand voice and messaging framework  
→ Digital presence optimization
→ Implementation guidelines for consistency
→ Launch strategy across all touchpoints

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">✨ See Brand Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Brand%20Refresh%20Project', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🎯 Start Brand Refresh</button>
<button onclick="window.selectSuggestion('How do you maintain brand equity during a refresh?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🔄 Brand Evolution</button>
</div>

What's driving the need for refresh? What aspects of your current brand still work?`,

      "Build a design system that scales": `**Design systems aren't component libraries—they're team operating systems.**

We've built design systems that scale from startup to Fortune 500: GE Healthcare (spanning multiple medical platforms), Allē (2M+ users), and enterprise systems serving 300K+ employees.

Here's how we think about systems that actually scale:

**→ People First, Technology Second**
The best design system is useless if your team won't use it. We design systems around how teams actually work, not how we think they should work.

**→ Living Documentation**
Static style guides die quickly. We build documentation that evolves with your product and teaches teams how to make good decisions independently.

**→ Governance That Works**
Systems need stewards, not dictators. We establish governance that ensures consistency without slowing innovation.

**Real Example: GE Healthcare Design System**
Challenge: 12 product teams, 50+ engineers, medical device regulations, multiple platforms (web, mobile, embedded).

Our system approach:
• **Component Library**: React, iOS, Android components with built-in accessibility
• **Design Tokens**: Consistent spacing, typography, color across all platforms
• **Documentation Hub**: Living examples, code snippets, usage guidelines
• **Contribution Process**: How teams propose new components or modifications
• **Quality Assurance**: Automated testing for visual regression and accessibility

Result: 60% faster development cycles, consistent user experience across all medical applications, reduced engineering overhead.

**What Makes Our Systems Different:**
→ Built for how teams actually work
→ Documentation that stays current
→ Automated quality assurance
→ Clear contribution processes  
→ Training that creates system advocates
→ Evolution planning for future needs

**The ROI:**
• Faster development cycles
• Consistent user experience
• Reduced design debt
• Easier team onboarding
• Better accessibility compliance
• Lower maintenance costs

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">🛠️ See System Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Design%20System%20Project', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⚡ Build Your System</button>
<button onclick="window.selectSuggestion('How long does it take to build a design system?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⏱️ System Timeline</button>
</div>

How many teams would use your design system? What's your biggest consistency challenge?`,

      "Improve our conversion rates": `**Conversion isn't about tactics—it's about removing friction.**

We've optimized conversion for products serving millions: Dollar Shave Club (23% mobile increase), Allē loyalty program (3x engagement), Ikon Pass (2.1 → 4.6 stars driving significant revenue).

Most teams focus on button colors and copy. We focus on understanding why people don't convert.

**Our Conversion Strategy:**

**→ Behavioral Analytics First**
We study what users actually do, not what they say they'll do. Heat maps and user recordings reveal the real conversion killers.

**→ Friction Audit**
Every step in your funnel has friction. We identify what's necessary friction (building trust) vs. what's pure obstacle.

**→ Psychological Triggers**
Social proof, scarcity, authority, reciprocity—we apply these strategically, not randomly.

**Real Example: Dollar Shave Club Mobile**
Challenge: Complex subscription onboarding on mobile with high abandonment rates.

Conversion blockers we found:
• Too many product options creating decision paralysis
• Shipping/billing information scattered across multiple screens  
• No clear value proposition for subscription vs. one-time purchase
• Payment security concerns on mobile

Our optimization:
• **Progressive Disclosure**: Show one decision at a time
• **Smart Defaults**: Pre-selected popular options with clear upgrade paths
• **Social Proof Integration**: Real customer reviews at decision points
• **Mobile-First Checkout**: One-page flow optimized for thumb navigation
• **Trust Indicators**: Security badges, satisfaction guarantees prominently displayed

Result: 23% increase in mobile conversion rate, reduced support tickets, higher lifetime value.

**Our Conversion Optimization Process:**
→ Analytics audit (what's actually happening)
→ User research (why people don't convert)  
→ Friction mapping (every obstacle identified)
→ A/B testing framework (systematic improvement)
→ Psychological optimization (strategic persuasion)
→ Performance monitoring (continuous improvement)

**Beyond Basic CRO:**
We don't just optimize existing funnels—we redesign conversion experiences from scratch when needed.

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://www.makebttr.com/work/', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📈 See Conversion Work</button>
<button onclick="window.open('mailto:hello@makebttr.com?subject=Conversion%20Rate%20Optimization', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">🎯 Optimize Conversions</button>
<button onclick="window.selectSuggestion('What conversion metrics should we track?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📊 Key Metrics</button>
</div>

What's your current conversion rate? Where in the funnel are people dropping off?`
    }

    if (conversationStarters[lastMessage.content]) {
      // Return conversation starter response directly
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:"${conversationStarters[lastMessage.content].replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`))
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

  // Check if streaming is disabled
  if (stream === false) {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: contextualPrompt,
      messages,
    })

    // Return in the format expected by AI SDK's useChat
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:"${result.text.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`))
        controller.close()
      }
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: contextualPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}