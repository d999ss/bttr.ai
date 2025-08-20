import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Head from 'next/head'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { GeistProvider, CssBaseline, Input, Grid, Text } from '@geist-ui/core'
import ErrorBoundary from '../components/ErrorBoundary'
import NetworkStatus from '../components/NetworkStatus'
import Portfolio from '../components/Portfolio'
import News from '../components/News'
import { trackEvent, trackEngagement } from '../lib/analytics'
import { generateCaseStudySummary, generateFullCaseStudy } from '../data/case-studies'

// Component for image content
function AssistantMessageWithImageWait({ content }) {
  // Removed the loading delay - content shows immediately
  return (
    <div style={{
      opacity: 1,
      animation: 'fadeIn 0.3s ease-in'
    }}>
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({children}) => <div style={{ marginBottom: '8px' }}>{children}</div>,
        strong: ({children}) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
        em: ({children}) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
        a: ({children, href}) => <a href={href} style={{ color: '#FFFFFF', textDecoration: 'underline', fontWeight: '500' }} target="_blank" rel="noopener noreferrer">{children}</a>,
        code: ({children}) => <code style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '2px 4px', borderRadius: '3px', fontSize: '13px' }}>{children}</code>,
        pre: ({children}) => <pre style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', overflow: 'auto', fontSize: '13px' }}>{children}</pre>,
        ul: ({children}) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
        ol: ({children}) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
        li: ({children}) => <li style={{ marginBottom: '4px' }}>{children}</li>,
        div: ({children, className}) => {
          if (className === 'conversation-buttons') {
            return <div className="conversation-buttons">{children}</div>
          }
          return <div className={className}>{children}</div>
        },
        button: ({children, onclick, onClick, style, ...props}) => {
          const handleClick = () => {
            // Handle both onclick attribute and onClick prop
            const clickHandler = onclick || onClick;
            if (clickHandler) {
              if (typeof clickHandler === 'string') {
                // Parse onclick string - handle window.open and window.selectSuggestion calls
                if (clickHandler.includes('window.open(')) {
                  const urlMatch = clickHandler.match(/window\.open\(['"]([^'"]+)['"]/);
                  if (urlMatch) {
                    window.open(urlMatch[1], '_blank');
                  }
                } else if (clickHandler.includes('window.selectSuggestion(')) {
                  const suggestionMatch = clickHandler.match(/window\.selectSuggestion\(['"]([^'"]+)['"]/);
                  if (suggestionMatch && window.selectSuggestion) {
                    window.selectSuggestion(suggestionMatch[1]);
                  }
                }
              } else if (typeof clickHandler === 'function') {
                clickHandler();
              }
            }
          };
          
          return (
            <button
              onClick={handleClick}
              style={{
                background: style?.background || 'rgba(255, 255, 255, 0.1)',
                border: style?.border || '1px solid rgba(255, 255, 255, 0.2)',
                color: style?.color || 'white',
                padding: style?.padding || '12px 24px',
                borderRadius: style?.borderRadius || '24px',
                fontSize: style?.fontSize || '14px',
                fontWeight: style?.fontWeight || '500',
                cursor: 'pointer',
                backdropFilter: style?.backdropFilter || 'blur(10px)',
                ...style
              }}
              {...props}
            >
              {children}
            </button>
          );
        },
        img: ({src, alt}) => {          
          return (
            <div style={{
              position: 'relative',
              width: '100%',
              marginBottom: '12px',
              marginTop: '8px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0a0a0a',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={src} 
                alt={alt} 
                className="chat-image"
                style={{ 
                  width: '100%', 
                  maxWidth: '100%', 
                  height: 'auto',
                  transition: 'opacity 0.3s ease'
                }} 
                loading="eager"
                decoding="async"
              />
            </div>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}

export default function Home() {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  const [sessionContext, setSessionContext] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [conversationStartTime, setConversationStartTime] = useState(null)
  const [welcomeText, setWelcomeText] = useState('')
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false)
  const [isMobileInputVisible, setIsMobileInputVisible] = useState(true) // Always show input on mobile
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [placeholderText, setPlaceholderText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showResetButtons, setShowResetButtons] = useState(false)
  const [showContactSuggestions, setShowContactSuggestions] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  
  // Memoized conversation suggestions
  const conversationSuggestions = useMemo(() => [
    "I'm trying to launch a new brand",
    "I need to build growth mechanics into the product",
    "Align teams for smooth product launches",
    "Turn customer feedback into product updates",
    "Help me redesign our mobile experience",
    "We need a complete brand refresh",
    "Build a design system that scales",
    "Improve our conversion rates"
  ], [])

  // Memoized contact suggestions
  const contactSuggestions = useMemo(() => [
    "What's your availability for new projects?",
    "Can we schedule a discovery call?",
    "What information do you need from us?",
    "How do you handle project timelines?",
    "What's your onboarding process?",
    "Can you share some client references?",
    "What's included in your strategy phase?",
    "How do you price different project types?"
  ], [])
  
  // Rotating placeholder messages
  const placeholderMessages = useMemo(() => [
    "Why are you here?",
    "Why are you stuck?",
    "What's broken in your business right now?",
    "What keeps you up at night?",
    "What's not working with your current approach?",
    "What's the real problem you're facing?",
    "What would happen if you don't fix this?",
    "What's stopping you from growing?",
    "What's your biggest business challenge?",
    "What's the real issue?"
  ], [])
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    error,
    append,
    setMessages
  } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      sessionContext: sessionContext,
      stream: false,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1024
    },
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })
  
  const [userScrolledUp, setUserScrolledUp] = useState(false)

  const scrollToBottom = useCallback(() => {
    // Only auto-scroll if user hasn't manually scrolled up and we have messages
    if (messagesEndRef.current && messages.length > 0 && !showPortfolio && !showNews && !userScrolledUp) {
      // Use requestAnimationFrame to ensure input field positioning is stable
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
        
        // Additional scroll adjustment to ensure clearance from input
        setTimeout(() => {
          const container = document.querySelector('.mobile-content')
          if (container) {
            // More aggressive scrolling on desktop to ensure message visibility
            const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
            const extraScroll = isDesktop ? 100 : 0
            container.scrollTop = container.scrollHeight + extraScroll
          }
        }, 100)
      })
    }
  }, [messages.length, showPortfolio, showNews, userScrolledUp])

  // Detect if user has scrolled up manually + Enhanced elastic scroll
  useEffect(() => {
    const chatContainer = document.querySelector('.mobile-content')
    if (!chatContainer) return

    let isScrolling = false
    let scrollTimeout = null

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer
      // More generous threshold on desktop to prevent auto-scroll interference
      const threshold = typeof window !== 'undefined' && window.innerWidth >= 768 ? 100 : 50
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold
      const isAtTop = scrollTop <= 10
      
      setUserScrolledUp(!isAtBottom)
      
      // Enhanced spring effect for iOS-like behavior
      if (!isScrolling) {
        isScrolling = true
        
        // Add subtle spring animation when hitting boundaries
        if (isAtTop || isAtBottom) {
          chatContainer.style.animation = 'springBounce 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          setTimeout(() => {
            if (chatContainer) {
              chatContainer.style.animation = ''
            }
          }, 400)
        }
      }
      
      // Reset scrolling flag after scroll ends
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 150)
    }

    chatContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Function to pause background videos on user interaction
  
  const handleProjectClick = useCallback((project) => {
    // Track portfolio interaction
    trackEngagement('project_click', project.name)
    
    // Mark chat as started for analytics (layout is now independent)
    setChatStarted(true)
    
    // Close portfolio and start chat
    setShowPortfolio(false)
    
    // Generate case study summary first
    const caseStudySummary = generateCaseStudySummary(project.id, project.name)
    
    // Send summary as assistant message
    setTimeout(() => {
      append({
        role: 'assistant',
        content: caseStudySummary
      })
      
      // Store project ID for potential "Learn More" request
      window.currentProjectId = project.id
      window.currentProjectName = project.name
    }, 100)
  }, [append, setChatStarted, setShowPortfolio])

  const handleNewsClick = (newsItem) => {
    // Track news interaction
    trackEngagement('news_click', newsItem.title)
    
    // Mark chat as started for analytics
    setChatStarted(true)
    
    // Close news immediately to prevent flash
    setShowNews(false)
    
    // Send a message to chat about the selected news item immediately
    append({
      role: 'user',
      content: `Tell me more about "${newsItem.title}"`
    })
  }
  
  const handleNameClick = useCallback(() => {
    // Mark chat as started for analytics (layout is now independent)
    setChatStarted(true)
    
    // Then clear the chat and hide portfolio and news
    setMessages([])
    setShowPortfolio(false)
    setShowNews(false)
    setShowContactSuggestions(false)
    
    // Skip welcome animation since this is a manual reset
    setIsWelcomeComplete(true)
    setWelcomeText("")
    
    // Track interaction
    trackEngagement('name_click', 'header')
    
    // Send "what's up" message with conversation starters
    setTimeout(() => {
      append({
        role: 'assistant',
        content: `What's up! 👋

Ready to explore what we can build together? Pick a topic below or ask me anything!

What are you interested in? Here are some topics we can dive into:

**Design Projects** - Learn about our visual work like the Ikon Pass app redesign or Air Company branding.
**Business Strategy** - Discover how we help brands with market positioning and growth outcomes.
**Innovation & Transformation** - Explore our Catalyst Program designed to help leaders outthink uncertainty.
**Recent News** - Get updates on our latest partnerships and projects.

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.selectSuggestion('Tell me about your design projects and visual work')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">🎨 Design Projects</button>
<button onclick="window.selectSuggestion('How do you help brands with business strategy and positioning?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📈 Business Strategy</button>
<button onclick="window.selectSuggestion('What is the Catalyst Program and how does it work?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">⚡ Innovation</button>
<button onclick="window.selectSuggestion('What are your latest news and partnerships?')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📰 Recent News</button>
</div>

Let me know what catches your interest!`
      })
      
      // Show reset buttons after message
      setShowResetButtons(true)
    }, 300)
  }, [append, setMessages, setShowPortfolio, setShowNews, setChatStarted, setIsWelcomeComplete, setWelcomeText])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Load session context from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('donny-session-context')
    if (saved) {
      try {
        setSessionContext(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse session context:', e)
      }
    }
  }, [])

  // Check for "tell me more" or "learn more" in user messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user' && 
        (lastMessage.content.toLowerCase().includes('tell me more') || 
         lastMessage.content.toLowerCase().includes('learn more') ||
         lastMessage.content.toLowerCase().includes('more details') ||
         lastMessage.content.toLowerCase().includes('dive deeper'))) {
      
      // Check if we have a current project context
      if (window.currentProjectId) {
        const fullCaseStudy = generateFullCaseStudy(window.currentProjectId)
        setTimeout(() => {
          append({
            role: 'assistant',
            content: fullCaseStudy
          })
        }, 100)
        
        // Clear the project context after showing full study
        delete window.currentProjectId
        delete window.currentProjectName
      }
    }
  }, [messages, append])

  // Check for completed contact response and show suggestions
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.content.includes('To explore collaboration opportunities') &&
        lastMessage.content.includes('We look forward to discussing how we can create impactful solutions together.') &&
        !isLoading) {
      // Show contact suggestions after the complete message is loaded
      setTimeout(() => {
        setShowContactSuggestions(true)
      }, 500)
    }
  }, [messages, isLoading])

  // Update session context based on conversation
  const updateSessionContext = (newMessages) => {
    const userMessages = newMessages.filter(msg => msg.role === 'user')
    const context = { ...sessionContext }
    
    // Track topics mentioned
    const topics = {
      design: /design|visual|ui|ux|interface|branding|identity/i,
      strategy: /strategy|business|growth|market|positioning/i,
      technology: /tech|development|code|api|platform|system/i,
      projects: /ikon|ge|pepsi|allergan|air company|portfolio/i,
      contact: /contact|email|hire|work together|collaborate/i,
      pricing: /cost|price|budget|rate|fee/i
    }
    
    userMessages.forEach(msg => {
      Object.entries(topics).forEach(([topic, regex]) => {
        if (regex.test(msg.content)) {
          context[`interested_in_${topic}`] = true
          context[`${topic}_mentions`] = (context[`${topic}_mentions`] || 0) + 1
        }
      })
    })
    
    // Track session stats
    context.total_messages = userMessages.length
    context.last_active = new Date().toISOString()
    context.session_start = context.session_start || new Date().toISOString()
    
    setSessionContext(context)
    localStorage.setItem('donny-session-context', JSON.stringify(context))
  }

  const startInactivityTimer = () => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Removed inactivity prompt - keeping timer structure for potential future use
  }

  const [previousMessageLength, setPreviousMessageLength] = useState(0)

  useEffect(() => {
    // Only scroll and reset scroll state when new messages are actually added
    if (messages.length > previousMessageLength) {
      // Reset scroll state when new messages arrive so auto-scroll works
      setUserScrolledUp(false)
      scrollToBottom()
      setPreviousMessageLength(messages.length)
    }
    
    updateSessionContext(messages)
    // Mark chat as started when first message appears
    if (messages.length > 0) {
      setChatStarted(true)
    }
    // Refocus input after bot responds
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus()
    }
  }, [messages, isLoading, previousMessageLength, scrollToBottom])

  // Simple fade-in for welcome message
  useEffect(() => {
    // Set text immediately
    setWelcomeText("When AI defines the future. We design the brands and experiences that thrive in it.")
    setIsWelcomeComplete(false)
    
    // Trigger fade-in after luxurious pause
    const fadeTimer = setTimeout(() => {
      setIsWelcomeComplete(true)
    }, 800)
    
    return () => {
      clearTimeout(fadeTimer)
    }
  }, [])

  // Auto-focus input on mount and ensure welcome message is visible
  useEffect(() => {
    // Unregister old service workers and force update
    if ('serviceWorker' in navigator) {
      // First, unregister all service workers to clear old cache
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister()
          console.log('Unregistered old service worker')
        }
      }).then(() => {
        // Re-register with new version if in production
        if (process.env.NODE_ENV === 'production') {
          // Add timestamp to force update
          navigator.serviceWorker.register('/sw.js?v=' + Date.now())
            .then(reg => {
              console.log('Service worker registered with new version')
              // Force update check
              reg.update()
            })
            .catch(() => {}) 
        }
      })
    }
    
    // Load Unicorn Studio Liquid background with retry logic
    const loadUnicornStudio = () => {
      const container = document.getElementById('unicorn-liquid-bg')
      if (!container) return
      
      // Set the project ID immediately
      container.setAttribute('data-us-project', 'lHlDvoJDIXCxxXVqTNOC')
      
      let retryCount = 0
      const maxRetries = 3
      
      const initUnicornStudio = () => {
        if (window.UnicornStudio) {
          try {
            window.UnicornStudio.destroy()
            window.UnicornStudio.init().then(scenes => {
              // Unicorn Studio Liquid loaded successfully
              container.style.opacity = '1'
            }).catch(error => {
              console.error('Unicorn Studio init error:', error)
              // Retry if failed
              if (retryCount < maxRetries) {
                retryCount++
                // Retrying Unicorn Studio initialization
                setTimeout(initUnicornStudio, 1000)
              }
            })
          } catch (error) {
            console.log('Unicorn Studio initialization error:', error)
            // Retry if failed
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`Retrying Unicorn Studio init (${retryCount}/${maxRetries})`)
              setTimeout(initUnicornStudio, 1000)
            }
          }
        } else {
          // UnicornStudio not loaded yet, retry
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`UnicornStudio not ready, retrying (${retryCount}/${maxRetries})`)
            setTimeout(initUnicornStudio, 1000)
          }
        }
      }
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="unicorn.studio"]')
      if (existingScript) {
        // Script exists, try to initialize
        setTimeout(initUnicornStudio, 100)
        return
      }
      
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js'
      
      script.onload = () => {
        // Unicorn Studio script loaded
        setTimeout(initUnicornStudio, 200)
      }
      
      script.onerror = () => {
        console.log('Failed to load Unicorn Studio script')
        // Try to reload the script
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying script load (${retryCount}/${maxRetries})`)
          setTimeout(() => {
            const newScript = script.cloneNode()
            document.head.appendChild(newScript)
          }, 1000)
        }
      }
      
      document.head.appendChild(script)
      
      return () => {
        if (window.UnicornStudio) {
          window.UnicornStudio.destroy()
        }
      }
    }
    
    const cleanupUnicorn = loadUnicornStudio()
    
    // Re-initialize Unicorn Studio on page visibility change (handles navigation)
    const handleVisibilityChange = () => {
      if (!document.hidden && window.UnicornStudio) {
        console.log('Page became visible, re-initializing liquid background')
        setTimeout(() => {
          const container = document.getElementById('unicorn-liquid-bg')
          if (container) {
            try {
              window.UnicornStudio.destroy()
              window.UnicornStudio.init().then(scenes => {
                console.log('Unicorn Studio Liquid re-initialized on visibility:', scenes)
                container.style.opacity = '1'
              }).catch(error => {
                console.log('Unicorn Studio visibility reinit error:', error)
              })
            } catch (error) {
              console.log('Unicorn Studio visibility reinitialization error:', error)
            }
          }
        }, 500)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Add global function for suggestion button clicks
    window.selectSuggestion = (suggestion) => {
      trackEngagement('suggestion_click', suggestion)
      append({
        role: 'user',
        content: suggestion
      })
    }
    
    // Aggressively ensure page starts at the top
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Only prevent document-level scrolling, allow content scrolling
    const preventDocumentScroll = (e) => {
      // Allow scrolling if target is within main content or input area
      if (e.target.closest('main') || 
          e.target.closest('.input-bar') ||
          e.target.tagName === 'TEXTAREA' || 
          e.target.tagName === 'INPUT') {
        return // Allow scrolling
      }
      e.preventDefault()
    }
    
    // Only prevent scroll on document/body, not on content
    document.addEventListener('touchmove', preventDocumentScroll, { passive: false })
    
    // Only reset scroll if it's on the document itself, not content
    const preventDocumentScrollEvent = (e) => {
      if (e.target === document || e.target === document.documentElement || e.target === document.body) {
        window.scrollTo(0, 0)
      }
    }
    document.addEventListener('scroll', preventDocumentScrollEvent, { passive: false })
    
    // Track page load
    trackEvent('page_load', {
      user_agent: navigator.userAgent,
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 1024,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 768
    })
    
    // For mobile, don't auto-focus to prevent keyboard popup on load
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Set initial visibility based on device type
    if (typeof window !== 'undefined') {
      setIsMobileInputVisible(true) // Always show input field
    }
    
    // Ensure welcome message is visible first
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      // Only auto-focus on desktop after welcome is complete
      if (!isMobile && isWelcomeComplete) {
        inputRef.current?.focus()
      }
    }, 100)
    
    // Re-focus on visibility change (for mobile app switching)
    const handleFocusOnVisibility = () => {
      if (!document.hidden) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
    
    document.addEventListener('visibilitychange', handleFocusOnVisibility)
    
    // Cleanup
    return () => {
      document.removeEventListener('touchmove', preventDocumentScroll)
      document.removeEventListener('scroll', preventDocumentScrollEvent)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('visibilitychange', handleFocusOnVisibility)
      if (cleanupUnicorn) {
        cleanupUnicorn()
      }
    }
  }, [isWelcomeComplete])

  useEffect(() => {
    // Start the inactivity timer when component mounts
    startInactivityTimer()
    
    // Cleanup on unmount
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [])


  // Static placeholder - no rotation
  useEffect(() => {
    setPlaceholderText('Ask us anything')
  }, [])

  // Generate unique session ID
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Log conversation to backend
  const logConversation = async (messages, isComplete = false) => {
    if (!sessionId) {
      // No sessionId available, skipping conversation logging
      return
    }

    // Logging conversation with session tracking

    try {
      const response = await fetch('/api/log-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          messages,
          metadata: {
            conversationStarted: conversationStartTime,
            conversationComplete: isComplete,
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        })
      })
      
      const result = await response.json()
      // Conversation logged successfully
    } catch (error) {
      console.error('Error logging conversation:', error)
    }
  }

  // Initialize session on first load
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      setConversationStartTime(new Date().toISOString())
    }
  }, [sessionId])

  // Log conversation whenever messages change
  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      // Log after a small delay to batch rapid changes
      const timeoutId = setTimeout(() => {
        logConversation(messages, false)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, sessionId])

  // Log final conversation when user leaves page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0 && sessionId) {
        // Use navigator.sendBeacon for reliable logging on page unload
        const data = JSON.stringify({
          sessionId,
          messages,
          metadata: {
            conversationStarted: conversationStartTime,
            conversationComplete: true,
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        })

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/log-conversation', data)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [messages, sessionId, conversationStartTime])

  const handleKeyPress = (e) => {
    // Clear inactivity timer on any key press
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Check if Snake game is active
    const lastMessage = messages[messages.length - 1]
    const isSnakeActive = lastMessage?.content?.includes('🐍 SNAKE GAME ACTIVATED 🐍')
    
    if (isSnakeActive) {
      // Snake game controls
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        append({
          role: 'assistant',
          content: '$ snake.exe running... Use arrow keys to play! (This is a demo - full game coming soon!)'
        })
        return
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        const direction = {
          'ArrowUp': '↑', 'w': '↑',
          'ArrowDown': '↓', 's': '↓', 
          'ArrowLeft': '←', 'a': '←',
          'ArrowRight': '→', 'd': '→'
        }[e.key.toLowerCase()]
        
        append({
          role: 'assistant',
          content: `$ snake moving ${direction} ... (Demo mode - full Snake game in development!)`
        })
        return
      }
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // User interaction
      // Close portfolio and news when user starts chatting
      if (showPortfolio) {
        setShowPortfolio(false)
      }
      if (showNews) {
        setShowNews(false)
      }
      if (showContactSuggestions) {
        setShowContactSuggestions(false)
      }
      handleSubmit(e)
    }
  }

  // Auto-sizing textarea functionality
  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return

    const autosize = () => {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px'
    }

    // Auto-size on input and change
    const handleInput = () => {
      autosize()
    }

    textarea.addEventListener('input', handleInput)
    textarea.addEventListener('change', handleInput)
    
    // Initial sizing
    autosize()

    return () => {
      textarea.removeEventListener('input', handleInput)
      textarea.removeEventListener('change', handleInput)
    }
  }, [])

  const handlePageClick = (e) => {
    // Clear inactivity timer on any click
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Don't focus if clicking on interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return
    }
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (!isMobile) {
      // Focus the input field immediately on desktop
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <GeistProvider themeType="dark">
      <CssBaseline />
      <ErrorBoundary>
        <Head>
        <title>Bttr. - Brand Strategy & Design Agency | Transform Your Brand with AI-Powered Innovation</title>
        <meta name="description" content="Bttr. is a premier brand strategy and design agency helping companies like Ikon Pass, Air Company & GE transform their brands. Get instant consultation with our AI-powered brand strategist. Book a strategy call today." />
        <meta name="keywords" content="brand strategy agency, brand design, brand transformation, AI brand consulting, brand positioning, brand identity, visual identity, brand refresh, startup branding, enterprise branding, Ikon Pass, Air Company, GE branding" />
        <meta name="author" content="Bttr." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Business Location & Contact */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="business.type" content="Brand Strategy Agency" />
        <meta name="business.hours" content="Mo-Fr 09:00-18:00" />
        
        {/* Rich Snippets for Services */}
        <meta name="service" content="Brand Strategy, Brand Design, Brand Transformation, AI Brand Consulting" />
        <meta name="target_audience" content="Startups, Enterprises, Business Leaders, CMOs, Founders" />
        
        {/* Performance & Loading */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bttr-ai.com/" />
        <meta property="og:title" content="Bttr. - Brand Strategy & Design Agency | Transform Your Brand" />
        <meta property="og:description" content="Premier brand strategy agency trusted by Ikon Pass, Air Company & GE. Get instant AI-powered brand consultation and book a strategy call. Transform your brand today." />
        <meta property="og:image" content="https://bttr-ai.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Bttr. Brand Strategy Agency" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://bttr-ai.com/" />
        <meta property="twitter:title" content="Bttr. - Transform Your Brand with AI-Powered Strategy" />
        <meta property="twitter:description" content="Premier brand agency trusted by Ikon Pass, Air Company & GE. Get instant consultation with our AI brand strategist. Book your strategy call today." />
        <meta property="twitter:image" content="https://bttr-ai.com/og-image.jpg" />
        <meta property="twitter:creator" content="@donnysmith" />
        <meta property="twitter:site" content="@makebttr" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://bttr-ai.com/" />
        
        {/* Performance Optimizations */}
        <link rel="dns-prefetch" href="https://www.makebttr.com" />
        <link rel="preconnect" href="https://www.makebttr.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bttr. Brand Strategy Agency",
              "alternateName": "Bttr.",
              "description": "Premier brand strategy and design agency specializing in brand transformation, visual identity, and AI-powered brand consulting for startups and enterprises.",
              "url": "https://bttr-ai.com",
              "logo": "https://bttr-ai.com/logo.png",
              "image": "https://bttr-ai.com/og-image.jpg",
              "sameAs": [
                "https://www.makebttr.com",
                "https://twitter.com/makebttr",
                "https://linkedin.com/company/makebttr"
              ],
              "foundingDate": "2020",
              "founders": [{
                "@type": "Person",
                "name": "Donny Smith"
              }],
              "knowsAbout": [
                "Brand Strategy",
                "Brand Transformation",
                "Visual Identity Design",
                "Brand Positioning",
                "AI Brand Consulting",
                "Enterprise Branding",
                "Startup Branding",
                "Design Systems",
                "Web Development"
              ]
            })
          }}
        />
        
        {/* Viewport and Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="dark only" />
        <meta name="supported-color-schemes" content="dark" />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --safe-bottom: env(safe-area-inset-bottom, 0px);
              --safe-top: env(safe-area-inset-top, 0px);
            }
            html, body { 
              margin: 0; 
              padding: 0; 
              background: #000; 
              color: #fff; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              height: 100%;
            }
            #__next { 
              min-height: 100dvh;
              min-height: 100svh; /* fallback */
              display: flex;
              flex-direction: column;
            }
            .welcome-message {
              font-size: 36px;
              line-height: 40px;
              font-weight: 500;
              text-align: center;
            }
          `
        }} />
        
        <style>{`
          /* Prevent document scroll but allow content scroll */
          html, body {
            height: 100dvh !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          
          #__next {
            height: 100dvh !important;
            overflow: hidden !important;
          }
          
          /* 
            FLOATING OVERLAY ARCHITECTURE:
            - Navigation header: Fixed overlay at top (z-index: 9998)
            - Input field: Fixed overlay at bottom (z-index: 9999)  
            - Main content: Flows underneath with fixed padding to account for overlays
            - All overlays are completely independent of content state/changes
          */
          
          @font-face {
            font-family: 'Neue Montreal';
            src: url('/NeueMontreal-Regular.woff2') format('woff2'),
                 url('/NeueMontreal-Regular.woff') format('woff'),
                 url('/NeueMontreal-Regular.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'Triakis';
            src: url('/TriakisFont-Regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'SuisseBPIntl';
            src: url('/SuisseBPIntl-Medium.woff2') format('woff2'),
                 url('/SuisseBPIntl-Medium.woff') format('woff'),
                 url('/SuisseBPIntl-Medium.otf') format('opentype');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes simple-pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          @keyframes springBounce {
            0% {
              transform: translateY(0px);
            }
            25% {
              transform: translateY(-2px);
            }
            50% {
              transform: translateY(1px);
            }
            75% {
              transform: translateY(-0.5px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          @keyframes elasticScroll {
            0% {
              transform: translateY(0);
            }
            20% {
              transform: translateY(-10px);
            }
            40% {
              transform: translateY(3px);
            }
            60% {
              transform: translateY(-1px);
            }
            80% {
              transform: translateY(0.3px);
            }
            100% {
              transform: translateY(0);
            }
          }
          
          
          .pulse-dot {
            width: 6px;
            height: 6px;
            background: #FFFFFF;
            border-radius: 50%;
            animation: simple-pulse 1.2s ease-in-out infinite;
          }
          
          .conversation-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 16px 0;
            max-width: 100%;
          }
          
          @media (max-width: 768px) {
            .conversation-buttons {
              gap: 6px;
              margin: 12px 0;
            }
            
            .conversation-buttons button {
              font-size: 11px !important;
              padding: 6px 12px !important;
            }
          }
          
          .cursor::after {
            content: '█';
            position: absolute;
            animation: blink 1s infinite;
            color: #38FE27;
            left: 0;
            top: 0;
            pointer-events: none;
            font-size: 12px;
            line-height: 1.2;
          }
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            color-scheme: dark;
          }
          
          html {
            color-scheme: dark;
          }
          * {
            box-sizing: border-box;
          }
          ::selection {
            background: #264F78;
            color: #D4D4D4;
          }
          ::-moz-selection {
            background: #264F78;
            color: #D4D4D4;
          }
          /* Removed global placeholder styles - handled by .input-field::placeholder */
          @media (max-width: 1024px) {
            /* Removed global font-size override that was breaking headline */
            .mobile-hide {
              display: none !important;
            }
            .mobile-show {
              display: flex !important;
            }
            .mobile-fullscreen {
              height: 100dvh !important;
              padding-top: 60px !important;
              padding-bottom: 80px !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: flex-start !important;
              overflow-y: auto !important;
              scroll-behavior: smooth !important;
            }
            .mobile-caret {
              font-size: 16px !important;
              line-height: 1.2 !important;
            }
            
            /* Enhanced mobile keyboard styling */
            .input-field,
            .input-field:disabled {
              -webkit-appearance: none !important;
              -webkit-text-fill-color: #FFFFFF !important;
              -webkit-user-select: text !important;
              -webkit-touch-callout: none !important;
              -webkit-tap-highlight-color: transparent !important;
              background-color: #1a1a1a !important;
              caret-color: #FFFFFF !important;
            }
            
            /* iOS keyboard dark mode */
            @supports (-webkit-touch-callout: none) {
              .input-field {
                color-scheme: dark !important;
              }
            }
            
            /* Input field uses consistent styling across breakpoints */
            
            /* Mobile input uses main .input-field styles */
            
            /* Removed problematic mobile image margins */
            
            /* Better mobile viewport handling */
            html {
              height: 100%;
              -webkit-text-size-adjust: 100%;
            }
            
            body {
              height: 100%;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              touch-action: manipulation;
            }
          }
        `}
        {`
          /* ChatGPT-style input with optimized spacing */
          :root {
            --h: 40px;
            --btn-size: 32px;
            --gap: 8px;
            --radius: 20px;
            --border: 2px;
            --safe-l: env(safe-area-inset-left);
            --safe-r: env(safe-area-inset-right);
            --safe-b: env(safe-area-inset-bottom);
            --kb: 0px;
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            clip: rect(0 0 0 0);
            overflow: hidden;
            white-space: nowrap;
          }

          .input-bar {
            position: fixed !important;
            bottom: max(env(safe-area-inset-bottom), 20px) !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 999999 !important;
            padding: 16px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(80px) saturate(150%);
            -webkit-backdrop-filter: blur(80px) saturate(150%);
            width: 100% !important;
            min-height: 80px !important; /* Ensure minimum height for visibility */
            box-sizing: border-box;
            pointer-events: auto;
            /* Complete isolation from content flow */
            margin: 0 !important;
            top: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          @media (min-width: 768px) {
            .input-bar {
              left: 0 !important;
              right: 0 !important;
              transform: none !important;
              max-width: none !important;
              width: 100% !important;
              padding: 16px 0;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
            }
          }
          
          @media (min-width: 1400px) {
            .input-bar {
              padding: 16px 64px;
            }
          }
          
          
          /* Global content container for perfect alignment */
          .content-container {
            width: 100%;
            max-width: 864px;
            padding: 0 32px;
            margin: 0 auto;
            box-sizing: border-box;
          }
          
          /* Nav content container width matching */
          .nav-content-container {
            width: 100%;
            max-width: 864px;
            padding: 8px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          }
          
          @media (min-width: 1400px) {
            .content-container,
            .nav-content-container {
              padding-left: 64px;
              padding-right: 64px;
            }
            
            .nav-content-container {
              padding: 8px 64px;
            }
            
            .input-bar {
              padding: 16px 0;
            }
            
            .input-bar > div {
              padding: 16px 64px !important;
            }
            
            .mobile-fullscreen > div {
              padding: 0 64px !important;
            }
          }
          
          /* Prevent layout shifts on header buttons */
          header button {
            contain: layout !important;
          }
          
          /* Disable problematic transitions during state changes */
          .input-bar, .input-field, main {
            transition: none !important;
          }
          
          
          /* Mobile-first redesign */
          @media (max-width: 1024px) {
            /* Hide desktop header on mobile */
            .mobile-hide {
              display: none !important;
            }
            
            /* Ensure mobile navigation shows */
            .mobile-show {
              display: flex !important;
            }
            
            /* Mobile header - improved spacing with safe areas */
            .mobile-header {
              display: flex !important;
              visibility: visible !important;
              opacity: 1 !important;
              height: calc(52px + env(safe-area-inset-top)) !important;
              padding: env(safe-area-inset-top) 20px 0 20px !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              z-index: 999999 !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            
            /* Force mobile header to show on mobile devices */
            @media (max-width: 1024px) {
              .mobile-header {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                background: rgba(0, 0, 0, 0.3) !important;
                backdrop-filter: blur(80px) !important;
                -webkit-backdrop-filter: blur(80px) !important;
              }
            }
            
            /* Mobile menu dropdown - show on mobile only */
            .mobile-menu-dropdown {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            /* Mobile content takes full viewport */
            .mobile-content {
              height: 100dvh !important;
              padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left) !important;
              display: flex !important;
              flex-direction: column !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              -webkit-overflow-scrolling: touch !important;
              overscroll-behavior: contain !important;
              -webkit-overscroll-behavior: contain !important;
              scroll-behavior: smooth !important;
            }
            
            /* Welcome message mobile styling */
            .mobile-welcome {
              flex: 1 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: flex-start !important;
              padding: 20px !important;
              text-align: left !important;
            }
            
            .mobile-welcome .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 42px !important;
              line-height: 40px !important;
              letter-spacing: -0.7px !important;
              font-weight: 500 !important;
              white-space: normal !important;
              text-align: left !important;
              margin: 0 !important;
              max-width: 100% !important;
              word-wrap: break-word !important;
              hyphens: auto !important;
            }
            
            /* Mobile welcome message styling */
            .mobile-welcome .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 28px !important;
              line-height: 32px !important;
              letter-spacing: -0.5px !important;
              font-weight: 500 !important;
              white-space: normal !important;
              text-align: center !important;
              margin: 0 !important;
              max-width: 100% !important;
              word-wrap: break-word !important;
              hyphens: auto !important;
            }
            
            /* Mobile conversation suggestions */
            .conversation-suggestions {
              padding: 0 16px !important;
            }
            
            .conversation-suggestions button {
              font-size: 14px !important;
              padding: 10px 16px !important;
            }
            
            /* Mobile-only input animations - always visible */
            @media (max-width: 767px) {
              .input-bar {
                transform: translateY(0) !important;
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
              }
              
              .input-bar.mobile-hidden {
                transform: translateY(0) !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
              
              .input-bar.mobile-visible {
                transform: translateY(0) !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
            }
            
            /* Mobile chat area */
            .mobile-chat {
              flex: 1 !important;
              overflow-y: auto !important;
              padding: 16px !important;
              padding-bottom: 140px !important; /* Space for input */
            }
            
            /* Mobile message styling */
            .mobile-message {
              margin-bottom: 16px !important;
              font-size: 16px !important;
              line-height: 1.5 !important;
              letter-spacing: 0.1px !important;
            }
            
            /* Override desktop message positioning on mobile - with proper margins */
            .message-container {
              max-width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              margin-bottom: 20px !important;
              padding: 0 !important;
            }
            
            /* Ensure Portfolio and News have proper spacing */
            .message-container.portfolio-enter {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            
            /* Force proper margins on Portfolio/News content */
            .message-container.portfolio-enter > div {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            
            
            
            /* Force mobile padding */
            main.mobile-content {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
          }

          .field-wrap {
            position: relative;
            width: 100%;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Simple Geist Input theming */
          .input-bar .geist-input {
            --geist-form-color: #FFFFFF;
            --geist-background: #1a1a1a;
            --geist-border: rgba(255, 255, 255, 0.25);
            --geist-border-hover: rgba(255, 255, 255, 0.4);
            --geist-border-focus: rgba(255, 255, 255, 0.6);
            --geist-placeholder: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(80px) saturate(150%);
          }
          
          /* Ensure perfect vertical centering with left text alignment */
          @media (min-height: 400px) {
            .mobile-welcome {
              display: flex !important;
              align-items: center !important;
              justify-content: flex-start !important;
              text-align: left !important;
            }
          }

          
          /* Desktop chat container - full width */
          @media (min-width: 1025px) {
            .mobile-show {
              display: none !important;
            }
            
            /* Hide mobile header on desktop */
            .mobile-header {
              display: none !important;
            }
            
            /* Hide mobile menu dropdown on desktop */
            .mobile-menu-dropdown {
              display: none !important;
            }
            .desktop-constrained {
              max-width: 1200px !important;
              margin: 0 auto !important;
              padding-left: 32px !important;
              padding-right: 32px !important;
            }
          }
          
          @media (min-width: 1400px) {
            .desktop-constrained {
              padding-left: 64px !important;
              padding-right: 64px !important;
            }
          }
          
          /* Messages - consistent left alignment for clean terminal look */
          @media (min-width: 768px) {
            .message-container:not(.mobile-welcome) {
              max-width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            /* Welcome message should be left-aligned */
            .mobile-welcome.message-container {
              max-width: none !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              display: flex !important;
              justify-content: flex-start !important;
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInFromRight {
            0% {
              opacity: 0;
              transform: translateX(20px) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          @keyframes slideInFromLeft {
            0% {
              opacity: 0;
              transform: translateX(-20px) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          @keyframes messagePop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            70% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .portfolio-enter {
            animation: fadeInUp 0.4s ease-out;
          }
          
          /* Mobile Portfolio and News spacing - with proper margins */
          @media (max-width: 767px) {
            .message-container.portfolio-enter {
              margin-top: 14px !important;
              margin-bottom: 20px !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            
            .message-container.portfolio-enter > div {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              padding-bottom: 20px !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
          }
          
          /* Medium breakpoint - match donnysmith.com sizing */
          @media (min-width: 768px) and (max-width: 1023px) {
            .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-weight: 500 !important;
              font-size: 32px !important;
              line-height: 36px !important;
              margin: 0 !important;
              letter-spacing: -0.6px !important;
              white-space: normal !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
          }
          
          /* Desktop welcome message - match donnysmith.com */
          @media (min-width: 1024px) {
            .welcome-message {
              font-family: 'SuisseBPIntl', 'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-weight: 500 !important;
              font-size: 36px !important;
              line-height: 40px !important;
              margin: 0 !important;
              letter-spacing: -0.7px !important;
              white-space: normal !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
          }
          
          /* iPhone Layout Fix - Stack header, content, input */
          @media (max-width: 768px) {
            /* Header at top - safe from notch */
            .mobile-header {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              height: 80px !important;
              padding-top: 40px !important; /* Safe area for notch */
              z-index: 1000 !important;
              background: rgba(0, 0, 0, 0.9) !important;
            }
            
            /* Content in middle - scrollable */
            .mobile-content {
              position: fixed !important;
              top: 80px !important; /* Below header */
              bottom: 100px !important; /* Above input */
              left: 0 !important;
              right: 0 !important;
              overflow-y: auto !important;
              padding: 20px !important;
            }
            
            /* Input at bottom - always visible */
            .input-bar {
              position: fixed !important;
              bottom: 20px !important; /* Safe from Safari bottom */
              left: 20px !important;
              right: 20px !important;
              height: 60px !important;
              z-index: 2000 !important;
              background: rgba(0, 0, 0, 0.9) !important;
              border-radius: 30px !important;
              display: flex !important;
              align-items: center !important;
              padding: 0 20px !important;
            }
            
            /* Force all child elements visible */
            div.input-bar,
            div.input-bar *,
            div.input-bar div,
            div.input-bar input,
            div.input-bar textarea {
              visibility: visible !important;
              opacity: 1 !important;
              display: block !important;
              background: rgba(255, 0, 0, 0.5) !important;
            }
            
            /* Ensure content doesn't overlap input */
            body {
              padding-bottom: 120px !important;
            }
            
            /* iPhone specific safe area handling */
            .mobile-fullscreen {
              padding-top: max(env(safe-area-inset-top), 44px) !important;
              min-height: calc(100vh - max(env(safe-area-inset-top), 44px) - 120px) !important;
            }
            
            /* Force safe areas on iPhone */
            @supports (padding: max(0px)) {
              .mobile-content {
                padding-top: max(env(safe-area-inset-top), 44px) !important;
              }
              
              .input-bar {
                bottom: max(env(safe-area-inset-bottom), 20px) !important;
                padding-bottom: max(env(safe-area-inset-bottom), 20px) !important;
              }
            }
          }
          
          /* Desktop: Ensure proper bottom spacing for chat messages */
          @media (min-width: 769px) {
            .mobile-content {
              padding-bottom: 200px !important; /* Extra bottom space on desktop */
            }
          }
            
            /* Center content vertically when only welcome message is shown */
            .mobile-fullscreen {
              min-height: calc(100vh - 100px) !important;
            }
          }
        `}</style>
      </Head>
      
      <noscript>
        <div style={{
          minHeight: '100vh',
          background: '#000000',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: "'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>JavaScript Required</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            This interactive experience requires JavaScript to be enabled.
          </p>
          <p style={{ fontSize: '14px', marginTop: '24px' }}>
            Contact: donny@makebttr.com
          </p>
        </div>
      </noscript>
      
      <NetworkStatus />
      
      
      <div 
        onClick={handlePageClick}
        role="main"
        aria-label="Chat interface"
        style={{
          minHeight: '100vh',
          height: '100vh',
          background: 'transparent',
          color: '#FFFFFF',
          fontFamily: "'Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '12px',
          lineHeight: '1.2',
          letterSpacing: '-0.19px',
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          touchAction: 'manipulation',
          margin: 0,
          cursor: 'text',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative'
        }}>
        
        {/* Animated Liquid Background */}
        <div
          id="unicorn-liquid-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundColor: '#000000',
            backgroundImage: 'none'
          }}
        />
        
        {/* Light overlay for text contrast only */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1
        }} />
        
        <div style={{
          width: '100%',
          maxWidth: '100vw',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'visible',
          zIndex: 2
        }}
        className="desktop-constrained">
        
        {/* Floating Navigation Header - Independent overlay */}
        <header className="mobile-hide" role="banner" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(80px) saturate(150%)',
          WebkitBackdropFilter: 'blur(80px) saturate(150%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Nav content container - matches conversation/input width */}
          <div className="nav-content-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 
              onClick={handleNameClick}
              style={{ 
                color: '#FFFFFF', 
                fontSize: '16px', 
                whiteSpace: 'nowrap', 
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                margin: 0, 
                fontWeight: 'normal',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Bttr.
            </h1>
            </div>
            
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={() => {
                // Toggle portfolio and hide news
                setShowNews(false)
                setShowPortfolio(!showPortfolio)
                trackEngagement('portfolio_toggle', showPortfolio ? 'close' : 'open')
              }}
              aria-label="View portfolio"
            >
              Work
            </button>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={() => {
                // Hide portfolio and news if showing and start catalyst chat
                setShowPortfolio(false)
                setShowNews(false)
                trackEngagement('catalyst_click', 'header')
                append({
                  role: 'user',
                  content: 'Tell me about the Catalyst Program'
                })
              }}
              aria-label="Learn about Catalyst Program"
            >
              Catalyst
            </button>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={() => {
                // Toggle news and hide portfolio
                setShowPortfolio(false)
                setShowNews(!showNews)
                trackEngagement('news_toggle', showNews ? 'close' : 'open')
              }}
              aria-label="View latest news"
            >
              News
            </button>
            <button 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '12px', 
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit'
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Hide portfolio and news if showing and start contact chat
                setShowPortfolio(false)
                setShowNews(false)
                trackEngagement('contact_click', 'header')
                append({
                  role: 'assistant',
                  content: `🚀 **Ready to transform your brand?** Let's make it happen.

We've helped brands like Ikon Pass, Air Company, and GE achieve breakthrough results. Your brand could be next.

**Here's how we can connect:**

📧 **Email Discussion** - Send us details about your project and we'll respond within 24 hours
📅 **Strategy Call** - Book a 30-minute consultation to explore how we can elevate your brand
📱 **Quick Chat** - Text or call for immediate questions

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('mailto:hello@makebttr.com?subject=Brand%20Transformation%20Project&body=Hi%20Bttr%20team%2C%0A%0AI%27m%20interested%20in%20discussing%20how%20you%20can%20help%20transform%20my%20brand.%0A%0AProject%20details%3A%0A-%20Company%2FBrand%20name%3A%0A-%20Industry%3A%0A-%20Current%20challenge%3A%0A-%20Goals%3A%0A-%20Timeline%3A%0A-%20Budget%20range%3A%0A%0ALooking%20forward%20to%20hearing%20from%20you%21', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📧 Email Project Details</button>
<button onclick="window.open('https://calendly.com/d999ss-rvyb', '_blank')" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book Strategy Call</button>
<button onclick="window.open('tel:+1234567890', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📱 Call Now</button>
</div>

**Don't wait.** The brands that move fast are the ones that win. Which option works best for you?`
                })
              }}
              aria-label="Contact for inquiries"
            >
              Contact
            </button>
            </div>
          </div>
        </header>


        {/* Mobile Navigation Header */}
        <header className="mobile-header mobile-show" role="banner" style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          paddingTop: '50px', // Safe distance from notch
          height: '90px',
          background: 'rgba(0, 0, 0, 0.9)',
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          zIndex: '1000',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Mobile Logo */}
          <h1 
            onClick={handleNameClick}
            style={{ 
              color: '#FFFFFF', 
              fontSize: '16px', 
              whiteSpace: 'nowrap', 
              margin: 0, 
              fontWeight: 'normal',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Bttr.
          </h1>
          
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ 
              color: '#FFFFFF', 
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: '1',
              fontFamily: 'monospace'
            }}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="mobile-menu-dropdown" style={{
            position: 'fixed',
            top: '52px',
            left: 0,
            right: 0,
            zIndex: 9997,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(80px) saturate(150%)',
            WebkitBackdropFilter: 'blur(80px) saturate(150%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px 16px',
            animation: 'fadeInDown 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '16px',
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowNews(false)
                  setShowPortfolio(!showPortfolio)
                  trackEngagement('portfolio_toggle', showPortfolio ? 'close' : 'open')
                }}
              >
                Work
              </button>
              <button 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '16px',
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowPortfolio(false)
                  setShowNews(false)
                  trackEngagement('catalyst_click', 'header')
                  append({
                    role: 'user',
                    content: 'Tell me about the Catalyst Program'
                  })
                }}
              >
                Catalyst
              </button>
              <button 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '16px',
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowPortfolio(false)
                  setShowNews(!showNews)
                  trackEngagement('news_toggle', showNews ? 'close' : 'open')
                }}
              >
                News
              </button>
              <button 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '16px',
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowMobileMenu(false)
                  setShowPortfolio(false)
                  setShowNews(false)
                  trackEngagement('contact_click', 'header')
                  append({
                    role: 'assistant',
                    content: `🚀 **Ready to transform your brand?** Let's make it happen.

We've helped brands like Ikon Pass, Air Company, and GE achieve breakthrough results. Your brand could be next.

**Here's how we can connect:**

📧 **Email Discussion** - Send us details about your project and we'll respond within 24 hours
📅 **Strategy Call** - Book a 30-minute consultation to explore how we can elevate your brand
📱 **Quick Chat** - Text or call for immediate questions

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('mailto:hello@makebttr.com?subject=Brand%20Transformation%20Project&body=Hi%20Bttr%20team%2C%0A%0AI%27m%20interested%20in%20discussing%20how%20you%20can%20help%20transform%20my%20brand.%0A%0AProject%20details%3A%0A-%20Company%2FBrand%20name%3A%0A-%20Industry%3A%0A-%20Current%20challenge%3A%0A-%20Goals%3A%0A-%20Timeline%3A%0A-%20Budget%20range%3A%0A%0ALooking%20forward%20to%20hearing%20from%20you%21', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📧 Email Project Details</button>
<button onclick="window.open('https://calendly.com/d999ss-rvyb', '_blank')" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book Strategy Call</button>
<button onclick="window.open('tel:+1234567890', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📱 Call Now</button>
</div>

**Don't wait.** The brands that move fast are the ones that win. Which option works best for you?`
                  })
                }}
              >
                Contact
              </button>
            </div>
          </div>
        )}

        {/* SCROLLABLE CHAT CONTENT */}
        <main className="mobile-content mobile-fullscreen" role="region" aria-label="Chat messages" style={{
          flex: '1 1 auto',
          minHeight: 'calc(100dvh - 200px)', // Ensure enough height to push footer down
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          WebkitOverscrollBehavior: 'contain',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'max(var(--safe-top), 90px)', // Safe from header
          paddingBottom: 'calc(96px + var(--kb, 0px) + env(safe-area-inset-bottom))',
          /* Dynamic spacing based on content type */
          ...(messages.length === 0 && !showPortfolio && !showNews ? {
            /* Welcome message: True viewport centering */
            justifyContent: 'center',
            padding: 0
          } : {
            /* Chat mode: Normal flow with minimal overlay clearance */
            justifyContent: 'flex-start',
            paddingTop: showMobileMenu ? 'calc(140px + max(env(safe-area-inset-top), 44px))' : 'calc(60px + max(env(safe-area-inset-top), 44px))',
            paddingBottom: typeof window !== 'undefined' && window.innerWidth >= 768 ? '240px' : 'calc(160px + env(safe-area-inset-bottom))'
          })
        }}>
          <div style={{
            width: '100%',
            maxWidth: '864px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            /* Dynamic styling based on content type */
            ...(messages.length === 0 && !showPortfolio && !showNews ? {
              /* Welcome message: Center positioning like donnysmith.com */
              minHeight: '100vh',
              padding: '80px 32px 140px 32px',
              justifyContent: 'center',
              alignItems: 'center'
            } : {
              /* Chat mode: Normal flow with input field matching padding */
              padding: '0 32px',
              justifyContent: 'flex-start',
              minHeight: 'auto'
            })
          }}>
          
          {/* Welcome Message */}
          {messages.length === 0 && !showPortfolio && !showNews && (
            <div className="mobile-welcome message-container" style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px'
            }}>
              <div 
                className="welcome-message"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  maxWidth: '100%',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
                }}>
                <div style={{ 
                  position: 'relative',
                  opacity: isWelcomeComplete ? 1 : 0,
                  transition: 'opacity 1.2s ease-out'
                }}>
                  {welcomeText}
                </div>
              </div>
              
              {/* Conversation Suggestions */}
              {isWelcomeComplete && (
                <div className="conversation-suggestions" style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  maxWidth: '600px',
                  opacity: isWelcomeComplete ? 1 : 0,
                  transform: isWelcomeComplete ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s ease-out 0.5s'
                }}>
                  {conversationSuggestions
                    .slice(0, isMobileDevice ? 5 : conversationSuggestions.length)
                    .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                            trackEngagement('suggestion_click', suggestion)
                        append({
                          role: 'user',
                          content: suggestion
                        })
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '24px',
                        padding: '8px 16px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Portfolio Section */}
          {showPortfolio && (
            <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
              <Portfolio onProjectClick={handleProjectClick} />
            </div>
          )}
          
          {/* News Section */}
          {showNews && (
            <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
              <News onNewsClick={handleNewsClick} />
            </div>
          )}
          
          {/* Chat Messages - responsive for both mobile and desktop */}
          <div>
            {messages.map((msg, i) => (
              msg.role === 'user' ? (
                <div key={msg.id || i} className="message-container" style={{ 
                  marginBottom: '8px',
                  marginTop: (i === 0) ? '32px' : '0px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}>
                  <div className="chat-message user-message" style={{
                    background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                    color: '#FFFFFF',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    padding: '10px 14px',
                    borderRadius: '18px',
                    maxWidth: window.innerWidth <= 768 ? '85%' : '70%',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    animation: 'slideInFromRight 0.3s ease-out',
                    transformOrigin: 'bottom right'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={msg.id || i} className="message-container" style={{ 
                  marginBottom: '8px',
                  marginTop: (i === 0) ? '32px' : '0px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%'
                }}>
                  <div className="chat-message assistant-message"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: '#FFFFFF',
                      padding: '10px 14px',
                      borderRadius: '18px',
                      maxWidth: window.innerWidth <= 768 ? '85%' : '70%',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      animation: 'slideInFromLeft 0.3s ease-out',
                      transformOrigin: 'bottom left'
                    }}>
                    {msg.content.includes('![') ? (
                      <AssistantMessageWithImageWait content={msg.content} />
                    ) : (
                      <ReactMarkdown
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({children}) => <div style={{ marginBottom: '8px' }}>{children}</div>,
                            strong: ({children}) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
                            em: ({children}) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                            a: ({children, href}) => <a href={href} style={{ color: '#FFFFFF', textDecoration: 'underline', fontWeight: '500' }} target="_blank" rel="noopener noreferrer">{children}</a>,
                            code: ({children}) => <code style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '2px 4px', borderRadius: '3px', fontSize: '13px' }}>{children}</code>,
                            pre: ({children}) => <pre style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', overflow: 'auto', fontSize: '13px' }}>{children}</pre>,
                            ul: ({children}) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
                            ol: ({children}) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
                            li: ({children}) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                            div: ({children, className}) => {
                              if (className === 'conversation-buttons') {
                                return <div className="conversation-buttons">{children}</div>
                              }
                              return <div className={className}>{children}</div>
                            },
                            button: ({children, onclick, onClick, style, ...props}) => {
                              const handleClick = () => {
                                // Handle both onclick attribute and onClick prop
                                const clickHandler = onclick || onClick;
                                if (clickHandler) {
                                  if (typeof clickHandler === 'string') {
                                    // Parse onclick string - handle window.open and window.selectSuggestion calls
                                    if (clickHandler.includes('window.open(')) {
                                      const urlMatch = clickHandler.match(/window\.open\(['"]([^'"]+)['"]/);
                                      if (urlMatch) {
                                        window.open(urlMatch[1], '_blank');
                                      }
                                    } else if (clickHandler.includes('window.selectSuggestion(')) {
                                      const suggestionMatch = clickHandler.match(/window\.selectSuggestion\(['"]([^'"]+)['"]/);
                                      if (suggestionMatch && window.selectSuggestion) {
                                        window.selectSuggestion(suggestionMatch[1]);
                                      }
                                    }
                                  } else if (typeof clickHandler === 'function') {
                                    clickHandler();
                                  }
                                }
                              };
                              
                              return (
                                <button
                                  onClick={handleClick}
                                  style={{
                                    background: style?.background || 'rgba(255, 255, 255, 0.1)',
                                    border: style?.border || '1px solid rgba(255, 255, 255, 0.2)',
                                    color: style?.color || 'white',
                                    padding: style?.padding || '12px 24px',
                                    borderRadius: style?.borderRadius || '24px',
                                    fontSize: style?.fontSize || '14px',
                                    fontWeight: style?.fontWeight || '500',
                                    cursor: 'pointer',
                                    backdropFilter: style?.backdropFilter || 'blur(10px)',
                                    ...style
                                  }}
                                  {...props}
                                >
                                  {children}
                                </button>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                    )}
                  </div>
                </div>
              )
          ))}
          </div>
          
          {/* Reset Conversation Suggestion Buttons */}
          {showResetButtons && (
            <div className="conversation-suggestions" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'flex-start',
              maxWidth: '100%',
              marginTop: '16px',
              marginBottom: '20px'
            }}>
              {conversationSuggestions
                .slice(0, isMobileDevice ? 5 : conversationSuggestions.length)
                .map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    trackEngagement('reset_suggestion_click', suggestion)
                    setShowResetButtons(false)
                    append({
                      role: 'user',
                      content: suggestion
                    })
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Contact Suggestion Buttons */}
          {showContactSuggestions && (
            <div className="conversation-suggestions" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'flex-start',
              maxWidth: '100%',
              marginTop: '16px',
              marginBottom: '20px'
            }}>
              {contactSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    trackEngagement('contact_suggestion_click', suggestion)
                    setShowContactSuggestions(false)
                    append({
                      role: 'user',
                      content: suggestion
                    })
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div role="status" aria-live="polite" aria-label="AI is thinking" style={{ 
              marginBottom: '8px',
              marginTop: '32px',
              color: '#FFFFFF',
              fontSize: '12px',
              lineHeight: '1.4',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '17px'
            }}>
              <div className="pulse-dot" style={{ animationDelay: '0s' }}></div>
              <div className="pulse-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="pulse-dot" style={{ animationDelay: '0.4s' }}></div>
              <span className="sr-only">Loading response...</span>
            </div>
          )}
          
          {error && (
            <div role="alert" aria-live="assertive" style={{ marginBottom: '8px' }}>
              <div style={{ 
                color: '#F44747',
                marginBottom: '1px',
                fontSize: '12px'
              }}>
                Error:
              </div>
              <div style={{
                color: '#F44747',
                paddingLeft: '12px',
                fontSize: '12px'
              }}>
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          )}
          {/* Extra padding to ensure last message is visible above input */}
          <div style={{ height: typeof window !== 'undefined' && window.innerWidth >= 768 ? '120px' : '60px' }} />
          <div ref={messagesEndRef} />
          </div>
        </main>


        {/* FIXED FOOTER INPUT - iOS Safari safe */}
        <footer style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 'calc(var(--safe-bottom) + var(--kb, 0px))',
          zIndex: 9999,
          paddingTop: '12px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            padding: '0 20px',
            height: '56px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <input
              ref={inputRef}
              placeholder={placeholderText || "Ask us anything"}
              value={input}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontFamily: 'inherit'
              }}
            />
            {input.trim() && !isLoading && (
              <button
                onClick={(e) => handleSubmit(e)}
                style={{
                  marginLeft: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px',
                  backgroundColor: '#007AFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span style={{ color: 'white', fontSize: '16px' }}>→</span>
              </button>
            )}
          </div>
        </footer>
        
        {/* Keyboard-safe spacing script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if('visualViewport' in window){
                  const vv = window.visualViewport;
                  const set = () => {
                    const overlap = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
                    document.documentElement.style.setProperty('--kb', overlap + 'px');
                    // Prevent conversation from moving up by maintaining scroll position
                    // removed body translateY; footer translates via --kb
                  };
                  ['resize','scroll'].forEach(e => vv.addEventListener(e, set));
                  set();
                } else {
                  window.addEventListener('focusin', () => {
                    document.documentElement.style.setProperty('--kb','12px');
                    // removed body translateY; footer translates via --kb
                  });
                  window.addEventListener('focusout', () => {
                    document.documentElement.style.setProperty('--kb','0px');
                    // removed body translateY; footer translates via --kb
                  });
                }
              })();
            `
          }}
        />
        </div>
      </div>
      </ErrorBoundary>
    </GeistProvider>
  )
}