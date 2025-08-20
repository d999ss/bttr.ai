import React from 'react'
import Portfolio from './Portfolio'
import News from './News'
import Subscription from './Subscription'

export default function Navigation({ 
  showMobileMenu, 
  setShowMobileMenu, 
  showPortfolio, 
  setShowPortfolio, 
  showNews, 
  setShowNews,
  showSubscription,
  setShowSubscription,
  handleNameClick,
  trackEngagement,
  append,
  onProjectClick,
  onNewsClick,
  onSubscriptionAction
}) {
  return (
    <>
      {/* Desktop Navigation Header */}
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
                setShowNews(false)
                setShowSubscription && setShowSubscription(false)
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
                setShowPortfolio(false)
                setShowNews(false)
                setShowSubscription && setShowSubscription(false)
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
                setShowPortfolio(false)
                setShowNews(!showNews)
                setShowSubscription && setShowSubscription(false)
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
                setShowPortfolio(false)
                setShowNews(false)
                setShowSubscription && setShowSubscription(!showSubscription)
                trackEngagement('subscription_toggle', showSubscription ? 'close' : 'open')
              }}
              aria-label="View subscription plans"
            >
              Subscribe
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
                setShowPortfolio(false)
                setShowNews(false)
                setShowSubscription && setShowSubscription(false)
                trackEngagement('contact_click', 'header')
                append({
                  role: 'assistant',
                  content: `🚀 **Ready to transform your brand?** Let's make it happen.

<div class="conversation-buttons">

<button onclick="window.open('https://calendly.com/d999ss-rvyb', '_blank')">Book Strategy Call</button>

<button onclick="window.selectSuggestion('I want to get in touch about a project')">Start Chat</button>

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
        paddingTop: '50px',
        height: '90px',
        background: 'rgba(0, 0, 0, 0.9)',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '1000',
        backdropFilter: 'blur(20px)'
      }}>
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
                setShowSubscription && setShowSubscription(false)
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
                fontFamily: 'inherit',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => {
                setShowMobileMenu(false)
                setShowPortfolio(false)
                setShowNews(false)
                setShowSubscription && setShowSubscription(!showSubscription)
                trackEngagement('subscription_toggle', showSubscription ? 'close' : 'open')
              }}
            >
              Subscribe
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
                setShowSubscription && setShowSubscription(false)
                trackEngagement('contact_click', 'header')
                append({
                  role: 'assistant',
                  content: `🚀 **Ready to transform your brand?** Let's make it happen.

<div class="conversation-buttons">

<button onclick="window.open('https://calendly.com/d999ss-rvyb', '_blank')">Book Strategy Call</button>

<button onclick="window.selectSuggestion('I want to get in touch about a project')">Start Chat</button>

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

      {/* Portfolio Section */}
      {showPortfolio && (
        <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
          <Portfolio onProjectClick={onProjectClick} />
        </div>
      )}
      
      {/* News Section */}
      {showNews && (
        <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
          <News onNewsClick={onNewsClick} />
        </div>
      )}
      
      {/* Subscription Section */}
      {showSubscription && (
        <div className="message-container portfolio-enter" style={{ marginTop: '24px' }}>
          <Subscription onSubscriptionAction={onSubscriptionAction} />
        </div>
      )}
    </>
  )
}