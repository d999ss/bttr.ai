# Bttr. AI Assistant

An AI assistant for makebttr.com that helps visitors explore creative solutions and make things better with AI.

## Features

- **Conversational AI**: Chat with GPT-4 powered assistant focused on creative innovation
- **Contact Integration**: Seamless way to get in touch for business inquiries
- **Open Source**: Transparent implementation for visitors to explore
- **Responsive Design**: Works on all devices
- **Real-time Chat**: Smooth conversation experience

## What the AI Knows

The assistant is trained on Bttr's:
- Professional background (digital branding and design firm)
- Services (brand strategy, visual identity, web design)
- Interests (AI projects, technology, creative problem-solving)
- Approach (systematic, optimization-focused, innovative)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom dark theme
- **Deployment**: Vercel

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your OpenAI API key
4. Run development server: `npm run dev`

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Deployment

This project is designed to deploy seamlessly on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## Customization

To adapt this for your own use:

1. Update the context in `data/donny-context.md`
2. Modify the UI components in `app/page.tsx`
3. Update metadata in `app/layout.tsx`
4. Customize styling in `app/globals.css`

## Contact Integration

The contact form currently logs submissions. To integrate with email services:

1. Install email service SDK (SendGrid, Resend, etc.)
2. Update `app/api/contact/route.ts` to send emails
3. Add necessary environment variables

## License

MIT - Feel free to use this as inspiration for your own AI assistant!