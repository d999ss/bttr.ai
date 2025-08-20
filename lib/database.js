import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initDatabase() {
  try {
    // Create conversations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        ended_at TIMESTAMP,
        user_agent TEXT,
        ip_address VARCHAR(255),
        referer TEXT,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Create messages table for storing individual messages
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (session_id) REFERENCES conversations(session_id) ON DELETE CASCADE
      );
    `;

    // Create analytics table for aggregated data
    await sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        total_conversations INTEGER DEFAULT 0,
        total_messages INTEGER DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        contact_requests INTEGER DEFAULT 0,
        avg_conversation_length FLOAT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(date)
      );
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);`;

    console.log('Database tables initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
}

// Save a conversation to the database
export async function saveConversation(sessionId, conversationData) {
  try {
    // Check if conversation exists
    const existingConversation = await sql`
      SELECT id FROM conversations WHERE session_id = ${sessionId}
    `;

    if (existingConversation.rows.length === 0) {
      // Create new conversation
      await sql`
        INSERT INTO conversations (
          session_id, 
          started_at, 
          ended_at, 
          user_agent, 
          ip_address, 
          referer, 
          metadata
        ) VALUES (
          ${sessionId},
          ${conversationData.conversationStarted || new Date()},
          ${conversationData.conversationEnded || new Date()},
          ${conversationData.metadata?.userAgent || ''},
          ${conversationData.metadata?.ip || ''},
          ${conversationData.metadata?.referer || ''},
          ${JSON.stringify(conversationData.metadata || {})}
        )
      `;
    } else {
      // Update existing conversation
      await sql`
        UPDATE conversations 
        SET 
          ended_at = ${conversationData.conversationEnded || new Date()},
          metadata = ${JSON.stringify(conversationData.metadata || {})},
          updated_at = NOW()
        WHERE session_id = ${sessionId}
      `;
    }

    // Delete existing messages for this session (to avoid duplicates)
    await sql`DELETE FROM messages WHERE session_id = ${sessionId}`;

    // Insert all messages
    if (conversationData.messages && conversationData.messages.length > 0) {
      for (const message of conversationData.messages) {
        await sql`
          INSERT INTO messages (session_id, role, content, timestamp)
          VALUES (
            ${sessionId},
            ${message.role},
            ${message.content},
            ${message.timestamp || new Date()}
          )
        `;
      }
    }

    // Update analytics
    await updateAnalytics();

    console.log(`Conversation saved to database: ${sessionId}`);
    return { success: true, sessionId };
  } catch (error) {
    console.error('Error saving conversation to database:', error);
    return { success: false, error: error.message };
  }
}

// Get all conversations from the database
export async function getConversations() {
  try {
    // Get conversations with message count
    const conversations = await sql`
      SELECT 
        c.*,
        COUNT(m.id) as message_count,
        array_agg(
          json_build_object(
            'role', m.role,
            'content', m.content,
            'timestamp', m.timestamp
          ) ORDER BY m.timestamp
        ) as messages
      FROM conversations c
      LEFT JOIN messages m ON c.session_id = m.session_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 100
    `;

    // Get analytics
    const analytics = await getAnalytics();

    return {
      conversations: conversations.rows.map(conv => ({
        sessionId: conv.session_id,
        timestamp: conv.created_at,
        messages: conv.messages || [],
        metadata: conv.metadata,
        conversationLength: conv.messages?.filter(m => m.role === 'user').length || 0,
        conversationStarted: conv.started_at,
        conversationEnded: conv.ended_at,
        lastUserMessage: conv.messages?.filter(m => m.role === 'user').slice(-1)[0]?.content
      })),
      analytics
    };
  } catch (error) {
    console.error('Error getting conversations from database:', error);
    // Return empty data if database not initialized
    return {
      conversations: [],
      analytics: {
        totalConversations: 0,
        todaysConversations: 0,
        averageLength: 0,
        longConversations: 0
      }
    };
  }
}

// Get analytics data
async function getAnalytics() {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Total conversations
    const totalResult = await sql`SELECT COUNT(*) as total FROM conversations`;
    const totalConversations = parseInt(totalResult.rows[0]?.total || 0);

    // Today's conversations
    const todayResult = await sql`
      SELECT COUNT(*) as total FROM conversations 
      WHERE DATE(created_at) = ${today}
    `;
    const todaysConversations = parseInt(todayResult.rows[0]?.total || 0);

    // This week's conversations
    const weekResult = await sql`
      SELECT COUNT(*) as total FROM conversations 
      WHERE DATE(created_at) >= ${weekAgo}
    `;
    const thisWeekConversations = parseInt(weekResult.rows[0]?.total || 0);

    // Average conversation length
    const avgResult = await sql`
      SELECT AVG(message_count) as avg_length
      FROM (
        SELECT session_id, COUNT(*) as message_count
        FROM messages
        WHERE role = 'user'
        GROUP BY session_id
      ) as counts
    `;
    const averageLength = Math.round(avgResult.rows[0]?.avg_length || 0);

    // Long conversations (5+ messages)
    const longResult = await sql`
      SELECT COUNT(DISTINCT session_id) as total
      FROM (
        SELECT session_id, COUNT(*) as message_count
        FROM messages
        WHERE role = 'user'
        GROUP BY session_id
        HAVING COUNT(*) >= 5
      ) as long_convs
    `;
    const longConversations = parseInt(longResult.rows[0]?.total || 0);

    // Conversion funnel stats
    const contactResult = await sql`
      SELECT COUNT(DISTINCT session_id) as total
      FROM messages
      WHERE LOWER(content) LIKE '%contact%' 
         OR LOWER(content) LIKE '%email%'
         OR LOWER(content) LIKE '%hello@makebttr.com%'
    `;
    const contactRequests = parseInt(contactResult.rows[0]?.total || 0);

    return {
      totalConversations,
      todaysConversations,
      thisWeekConversations,
      averageLength,
      longConversations,
      conversionFunnelStats: {
        totalVisitors: totalConversations,
        engagedUsers: Math.round(totalConversations * 0.6),
        deepEngagement: longConversations,
        contactRequests
      }
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      totalConversations: 0,
      todaysConversations: 0,
      averageLength: 0,
      longConversations: 0
    };
  }
}

// Update daily analytics
async function updateAnalytics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const analytics = await getAnalytics();

    await sql`
      INSERT INTO analytics (
        date,
        total_conversations,
        total_messages,
        unique_visitors,
        contact_requests,
        avg_conversation_length
      ) VALUES (
        ${today},
        ${analytics.totalConversations},
        ${analytics.totalConversations * analytics.averageLength},
        ${analytics.totalConversations},
        ${analytics.conversionFunnelStats.contactRequests},
        ${analytics.averageLength}
      )
      ON CONFLICT (date) 
      DO UPDATE SET
        total_conversations = ${analytics.totalConversations},
        total_messages = ${analytics.totalConversations * analytics.averageLength},
        unique_visitors = ${analytics.totalConversations},
        contact_requests = ${analytics.conversionFunnelStats.contactRequests},
        avg_conversation_length = ${analytics.averageLength},
        updated_at = NOW()
    `;
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

// Export functions for use in API routes
export default {
  initDatabase,
  saveConversation,
  getConversations
};