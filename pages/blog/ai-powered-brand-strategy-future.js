import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Portfolio from '../../components/Portfolio'
import News from '../../components/News'

export default function AIPoweredBrandStrategy() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [showNews, setShowNews] = useState(false)
  
  const handleNameClick = () => {
    window.location.href = '/'
  }
  
  // Mock functions for blog pages since they don't have chat functionality
  const trackEngagement = (event, action) => {
    console.log('Track engagement:', event, action)
  }
  
  const append = (message) => {
    console.log('Would append message:', message)
    // Redirect to homepage to start chat
    window.location.href = '/'
  }
  
  const handleProjectClick = (project) => {
    console.log('Project clicked:', project)
    // Redirect to homepage to start chat about project
    window.location.href = '/'
  }
  
  const handleNewsClick = (newsItem) => {
    console.log('News clicked:', newsItem)
    // Redirect to homepage to start chat about news
    window.location.href = '/'
  }
  
  return (
    <>
      <Head>
        <title>AI-Powered Brand Strategy: The Future of Business Growth | Bttr.</title>
        <meta name="description" content="Discover how AI is revolutionizing brand strategy and helping companies achieve 300% growth. Get insights from our AI brand strategist and book a consultation." />
        <meta name="keywords" content="AI brand strategy, artificial intelligence branding, AI marketing, brand innovation, digital transformation, AI consulting" />
        <link rel="canonical" href="https://bttr-ai.com/blog/ai-powered-brand-strategy-future" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI-Powered Brand Strategy: The Future of Business Growth" />
        <meta property="og:description" content="How AI is transforming brand strategy and helping companies achieve explosive growth. Expert insights and real results." />
        <meta property="og:url" content="https://bttr-ai.com/blog/ai-powered-brand-strategy-future" />
        <meta property="og:type" content="article" />
        
        <style jsx global>{`
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
            .nav-content-container {
              padding-left: 64px;
              padding-right: 64px;
              padding: 8px 64px;
            }
          }
          
          @media (max-width: 1024px) {
            .mobile-hide {
              display: none !important;
            }
            .mobile-show {
              display: flex !important;
            }
          }
          
          /* Desktop */
          @media (min-width: 1025px) {
            .mobile-show {
              display: none !important;
            }
            
            /* Hide mobile menu dropdown on desktop */
            .mobile-menu-dropdown {
              display: none !important;
            }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Head>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
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
              onClick={() => {
                trackEngagement('contact_click', 'header')
                append({
                  role: 'user',
                  content: 'I want to get in touch about a project'
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
          padding: '50px 20px 0 20px',
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
                  trackEngagement('catalyst_click', 'mobile')
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
                onClick={() => {
                  setShowMobileMenu(false)
                  trackEngagement('contact_click', 'mobile')
                  append({
                    role: 'user',
                    content: 'I want to get in touch about a project'
                  })
                }}
              >
                Contact
              </button>
            </div>
          </div>
        )}

        {/* Article */}
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px 80px' }}>
          <header style={{ marginBottom: '48px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              lineHeight: '1.2',
              marginBottom: '24px'
            }}>
              The Future of Brand Strategy: How AI is Revolutionizing Business Growth
            </h1>
            
            <p style={{ 
              fontSize: '20px', 
              color: '#ccc', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Artificial Intelligence isn't just changing how we work—it's transforming how brands connect with customers and drive growth. Here's what every business leader needs to know about AI-powered brand strategy.
            </p>
          </header>

          <div style={{ fontSize: '18px', lineHeight: '1.7', color: '#e5e5e5' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              The AI Brand Strategy Revolution
            </h2>
            <p style={{ marginBottom: '24px' }}>
              Traditional brand strategy relied on intuition, market research, and creative expertise. While these remain important, AI is adding a new dimension: <strong>predictive intelligence</strong> that can analyze millions of data points to identify opportunities human strategists might miss.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Real Results from AI Brand Strategy
            </h2>
            <p style={{ marginBottom: '20px' }}>
              Our AI-powered approach has delivered remarkable results for clients:
            </p>
            <ul style={{ marginBottom: '24px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>300% increase in brand engagement</strong> through AI-optimized messaging</li>
              <li style={{ marginBottom: '12px' }}><strong>150% improvement in conversion rates</strong> via personalized brand experiences</li>
              <li style={{ marginBottom: '12px' }}><strong>60% reduction in brand development time</strong> using AI-assisted creative processes</li>
            </ul>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              How AI Enhances Every Aspect of Brand Strategy
            </h2>
            
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#007AFF' }}>
              Market Intelligence & Positioning
            </h3>
            <p style={{ marginBottom: '24px' }}>
              AI analyzes vast amounts of market data, competitor intelligence, and consumer behavior patterns to identify optimal positioning opportunities. What used to take months of research can now be accomplished in days with unprecedented accuracy.
            </p>

            <h3 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#007AFF' }}>
              Personalized Brand Experiences
            </h3>
            <p style={{ marginBottom: '24px' }}>
              AI enables brands to deliver personalized experiences at scale. By analyzing customer data and behavior patterns, brands can tailor messaging, visuals, and touchpoints to resonate with specific audience segments.
            </p>

            <h3 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#007AFF' }}>
              Predictive Brand Performance
            </h3>
            <p style={{ marginBottom: '24px' }}>
              Before launching campaigns or brand initiatives, AI can predict their likely performance based on historical data and market conditions. This reduces risk and improves ROI on brand investments.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              The Human + AI Advantage
            </h2>
            <p style={{ marginBottom: '24px' }}>
              The most successful brand strategies combine AI intelligence with human creativity and intuition. AI handles data processing and pattern recognition, while humans provide strategic thinking, creative vision, and emotional intelligence.
            </p>

            <p style={{ marginBottom: '24px' }}>
              This hybrid approach allows brands to move faster, make better decisions, and create more meaningful connections with their audiences.
            </p>
          </div>

          {/* CTA */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(0,122,255,0.2)',
            borderRadius: '16px',
            padding: '40px 32px',
            textAlign: 'center',
            marginTop: '64px'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>
              Experience AI-Powered Brand Strategy
            </h3>
            <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '32px' }}>
              Chat with our AI brand strategist to see how AI can transform your brand, or book a strategy call with our team.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                Chat with AI Strategist
              </Link>
              <Link href="https://calendly.com/d999ss-rvyb" style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                Book Strategy Call
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}