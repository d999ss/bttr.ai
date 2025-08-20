/**
 * NativeChat Component
 * 
 * iOS Messages-style chat interface component created during chat UX research.
 * This component demonstrates native iOS messaging patterns and styling.
 * Kept as reference for future mobile chat implementations.
 * 
 * Features:
 * - iOS Messages UI recreation
 * - Native styling with message bubbles and tails
 * - Dark mode support
 * - iPhone safe area handling
 */

import React, { useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'

export default function NativeChat() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading 
  } = useChat({
    api: '/api/chat',
    initialMessages: []
  })

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  }

  return (
    <>
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="contact-info">
            <div className="avatar">🤖</div>
            <div className="contact-details">
              <h1>Bttr.</h1>
              <span>AI Brand Strategist</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-avatar">🤖</div>
              <h2>Welcome to Bttr.</h2>
              <p>I'm your AI brand strategist. Ask me anything about brand strategy, product design, or growth.</p>
            </div>
          )}

          {messages.map((message, index) => {
            const isLast = index === messages.length - 1 || 
                          (index < messages.length - 1 && messages[index + 1].role !== message.role)
            
            return (
              <div 
                key={index} 
                className={`message-wrapper ${message.role === 'user' ? 'mine' : 'yours'}`}
              >
                <div className={`message ${isLast ? 'last' : ''}`}>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessage(message.content) 
                    }}
                  />
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="message-wrapper yours">
              <div className="message typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="iMessage"
              className="message-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`send-button ${input.trim() ? 'active' : ''}`}
              disabled={!input.trim() || isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .chat-container {
          height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          position: relative;
        }

        .chat-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
          padding: 8px 16px;
          padding-top: max(8px, env(safe-area-inset-top));
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007AFF, #0051D5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
        }

        .contact-details h1 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          color: #000;
        }

        .contact-details span {
          font-size: 13px;
          color: #8E8E93;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 8px 16px;
          padding-bottom: 100px;
          background: #ffffff;
        }

        .welcome-message {
          text-align: center;
          padding: 40px 20px;
          margin-top: 20px;
        }

        .welcome-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007AFF, #0051D5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          margin: 0 auto 20px;
        }

        .welcome-message h2 {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px;
        }

        .welcome-message p {
          font-size: 16px;
          color: #8E8E93;
          line-height: 1.4;
          margin: 0;
        }

        .message-wrapper {
          display: flex;
          margin: 2px 0;
        }

        .message-wrapper.yours {
          justify-content: flex-start;
        }

        .message-wrapper.mine {
          justify-content: flex-end;
        }

        .message {
          border-radius: 18px;
          padding: 8px 12px;
          max-width: 70%;
          position: relative;
          font-size: 16px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .yours .message {
          background-color: #E9E9EB;
          color: #000;
          margin-right: 25%;
        }

        .yours .message.last:before {
          content: "";
          position: absolute;
          z-index: 0;
          bottom: 0;
          left: -7px;
          height: 20px;
          width: 20px;
          background: #E9E9EB;
          border-bottom-right-radius: 15px;
        }


        .mine .message {
          background: linear-gradient(135deg, #007AFF, #0051D5);
          color: white;
          margin-left: 25%;
        }

        .mine .message.last:before {
          content: "";
          position: absolute;
          z-index: 0;
          bottom: 0;
          right: -7px;
          height: 20px;
          width: 20px;
          background: linear-gradient(135deg, #007AFF, #0051D5);
          border-bottom-left-radius: 15px;
        }


        .typing {
          background-color: #E9E9EB !important;
          padding: 12px 16px !important;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8E8E93;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-top: 0.5px solid rgba(0, 0, 0, 0.1);
          padding: 8px 16px;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: #F2F2F7;
          border: none;
          border-radius: 20px;
          padding: 6px 8px 6px 16px;
        }

        .message-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          line-height: 1.4;
          padding: 6px 0;
          background: transparent;
          color: #000;
          font-family: inherit;
          min-height: 20px;
        }

        .message-input::placeholder {
          color: #8E8E93;
        }

        .send-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #8E8E93;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button.active {
          background: #007AFF;
          transform: scale(1.05);
        }

        .send-button:disabled {
          cursor: not-allowed;
          transform: scale(1);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .chat-container {
            background: #000000;
          }

          .chat-header {
            background: rgba(0, 0, 0, 0.95);
            border-bottom-color: rgba(255, 255, 255, 0.1);
          }

          .contact-details h1 {
            color: #ffffff;
          }

          .messages-container {
            background: #000000;
          }

          .welcome-message h2 {
            color: #ffffff;
          }

          .yours .message {
            background-color: #3C3C43;
            color: #ffffff;
          }

          .yours .message.last:before {
            background: #3C3C43;
          }


          .input-container {
            background: rgba(0, 0, 0, 0.95);
            border-top-color: rgba(255, 255, 255, 0.1);
          }

          .input-wrapper {
            background: #1C1C1E;
          }

          .message-input {
            color: #ffffff;
          }

          .typing {
            background-color: #3C3C43 !important;
          }

          .typing-indicator span {
            background: #8E8E93;
          }
        }

        /* iPhone safe areas */
        @supports (padding-top: env(safe-area-inset-top)) {
          .chat-header {
            padding-top: max(8px, env(safe-area-inset-top));
          }
          
          .input-container {
            padding-bottom: max(8px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  )
}