import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ConversationAdmin() {
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [analytics, setAnalytics] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('bttr_admin_auth')
    if (authToken !== 'authenticated') {
      router.push('/admin')
      return
    }
    setIsAuthenticated(true)
    loadConversations()
  }, [router])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get-conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    switch (filter) {
      case 'today':
        return new Date(conv.timestamp).toDateString() === new Date().toDateString()
      case 'this-week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(conv.timestamp) > weekAgo
      case 'long':
        return conv.conversationLength >= 5
      case 'short':
        return conv.conversationLength <= 2
      default:
        return true
    }
  })

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timestamp) - new Date(a.timestamp)
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp)
      case 'longest':
        return b.conversationLength - a.conversationLength
      case 'shortest':
        return a.conversationLength - b.conversationLength
      default:
        return new Date(b.timestamp) - new Date(a.timestamp)
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConversationSummary = (messages) => {
    const userMessages = messages.filter(msg => msg.role === 'user')
    if (userMessages.length === 0) return 'No user messages'
    
    const firstMessage = userMessages[0].content
    return firstMessage.length > 100 ? firstMessage.substring(0, 100) + '...' : firstMessage
  }

  const handleLogout = () => {
    localStorage.removeItem('bttr_admin_auth')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Conversation Analytics - Bttr AI Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Conversation Analytics
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={loadConversations}
                style={{
                  background: '#007AFF',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Refresh
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Analytics Overview */}
          {analytics && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              marginBottom: '30px' 
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#888' }}>Total Conversations</h3>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{analytics.totalConversations}</p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#888' }}>Today</h3>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{analytics.todaysConversations}</p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#888' }}>Avg Messages</h3>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{analytics.averageLength}</p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#888' }}>Long Conversations</h3>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{analytics.longConversations}</p>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
            {/* Filters and Conversation List */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Conversations</option>
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="long">Long (5+ messages)</option>
                    <option value="short">Short (1-2 messages)</option>
                  </select>
                  
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="longest">Longest First</option>
                    <option value="shortest">Shortest First</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                maxHeight: '600px', 
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Loading conversations...
                  </div>
                ) : sortedConversations.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    No conversations found
                  </div>
                ) : (
                  sortedConversations.map((conv, index) => (
                    <div
                      key={conv.sessionId}
                      onClick={() => setSelectedConversation(conv)}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        background: selectedConversation?.sessionId === conv.sessionId 
                          ? 'rgba(0, 122, 255, 0.1)' 
                          : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedConversation?.sessionId !== conv.sessionId) {
                          e.target.style.background = 'rgba(255, 255, 255, 0.03)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedConversation?.sessionId !== conv.sessionId) {
                          e.target.style.background = 'transparent'
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {formatDate(conv.timestamp)}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          background: 'rgba(0, 122, 255, 0.2)',
                          color: '#60a5fa',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {conv.conversationLength} msgs
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.3' }}>
                        {getConversationSummary(conv.messages)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Conversation Detail */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '20px'
            }}>
              {selectedConversation ? (
                <>
                  <div style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '15px' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                      Conversation Details
                    </h2>
                    <div style={{ fontSize: '14px', color: '#888' }}>
                      <p style={{ margin: '4px 0' }}>Started: {formatDate(selectedConversation.conversationStarted)}</p>
                      <p style={{ margin: '4px 0' }}>Messages: {selectedConversation.conversationLength} user messages</p>
                      <p style={{ margin: '4px 0' }}>Session: {selectedConversation.sessionId}</p>
                      {selectedConversation.metadata?.referer && (
                        <p style={{ margin: '4px 0' }}>Referrer: {selectedConversation.metadata.referer}</p>
                      )}
                    </div>
                  </div>

                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {selectedConversation.messages.map((message, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: '16px',
                          padding: '12px',
                          background: message.role === 'user' 
                            ? 'rgba(0, 122, 255, 0.1)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          borderLeft: `3px solid ${message.role === 'user' ? '#007AFF' : '#888'}`
                        }}
                      >
                        <div style={{ 
                          fontSize: '12px', 
                          color: message.role === 'user' ? '#60a5fa' : '#888',
                          marginBottom: '6px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {message.role === 'user' ? 'User' : 'AI Assistant'}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ 
                  height: '400px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#888',
                  fontSize: '16px'
                }}>
                  Select a conversation to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}