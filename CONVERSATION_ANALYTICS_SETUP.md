# Conversation Analytics Setup

## Overview
This system tracks all visitor conversations with your AI to help you understand user needs and improve the experience.

## Features
- **Real-time conversation logging** - Every chat is automatically saved
- **Admin dashboard** - View all conversations with filtering and sorting
- **Analytics overview** - Key metrics and insights
- **Conversation details** - Full message history for each session
- **User privacy** - Data stored locally, no external services

## Access the Dashboard

### 1. Set Admin Password (Optional)
Add to your `.env.local` file:
```
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
```

If not set, default password is: `bttr2024`

### 2. Access the Dashboard
Go to: `http://localhost:3001/admin`

### 3. Dashboard Features

#### Analytics Overview
- Total conversations
- Today's conversations  
- Average message length
- Long conversations (5+ messages)

#### Conversation List
- Filter by: All, Today, This Week, Long, Short
- Sort by: Recent, Oldest, Longest, Shortest
- Click any conversation to view details

#### Conversation Details
- Full message history
- Session information
- User metadata (referrer, user agent)
- Timestamps for each message

## How It Works

### Automatic Logging
1. **Session Creation** - Each visitor gets a unique session ID
2. **Message Tracking** - Every user message and AI response is logged
3. **Real-time Updates** - Conversations are saved as they happen
4. **Session Completion** - Final state saved when user leaves

### Data Storage
- **Location**: `/conversation-logs/` directory
- **Format**: JSON Lines (.jsonl) for daily logs + individual conversation files
- **Organization**: Daily files (`conversations-2024-08-19.jsonl`)
- **Individual Files**: `conversation-{sessionId}.json`

### Privacy & Security
- **Local Storage**: All data stays on your server
- **No External Services**: No third-party analytics
- **Password Protected**: Admin access requires authentication
- **Anonymous Data**: No personal identification stored

## Common Use Cases

### 1. Improve AI Responses
- See which questions confuse users
- Identify conversation drop-off points
- Find topics that need better responses

### 2. Content Optimization
- Discover what users really want to know
- See which conversation starters work best
- Identify new content opportunities

### 3. User Experience Insights
- Track conversation length trends
- See peak usage times
- Understand user behavior patterns

### 4. Business Intelligence
- Monitor lead qualification effectiveness
- Track conversion conversation patterns
- Identify high-intent visitor behavior

## Files Added

### API Endpoints
- `/pages/api/log-conversation.js` - Logs conversations
- `/pages/api/get-conversations.js` - Retrieves conversation data

### Admin Interface
- `/pages/admin/index.js` - Login page
- `/pages/admin/conversations.js` - Analytics dashboard

### Updated Files
- `/pages/index.js` - Added conversation tracking

## Maintenance

### Viewing Raw Data
```bash
# View today's conversations
cat conversation-logs/conversations-2024-08-19.jsonl

# View specific conversation
cat conversation-logs/conversation-session_123456.json
```

### Data Cleanup
Conversation logs accumulate over time. Consider:
- Archiving old daily log files
- Setting up log rotation
- Regular backups of important conversations

## Troubleshooting

### Dashboard Won't Load
- Check if admin password is correct
- Ensure conversation-logs directory exists
- Check browser console for errors

### No Conversations Showing
- Make sure visitors are actually chatting
- Check if logging API is working (`/api/log-conversation`)
- Verify session tracking is working

### High Storage Usage
- Large conversations accumulate quickly
- Consider implementing data retention policies
- Archive or compress old conversation logs

This system gives you complete visibility into how visitors interact with your AI, helping you continuously improve the experience and convert more visitors into clients.