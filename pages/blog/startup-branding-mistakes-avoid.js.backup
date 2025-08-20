import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function StartupBrandingMistakes() {
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
  
  return (
    <>
      <Head>
        <title>7 Fatal Startup Branding Mistakes That Kill Growth | Bttr. Agency</title>
        <meta name="description" content="Avoid the branding pitfalls that kill 90% of startups. Learn from real case studies and get our free brand audit checklist. Expert startup branding guide." />
        <meta name="keywords" content="startup branding, startup marketing, brand mistakes, startup brand strategy, brand audit, startup growth, branding pitfalls" />
        <link rel="canonical" href="https://bttr-ai.com/blog/startup-branding-mistakes-avoid" />
        
        {/* Open Graph */}
        <meta property="og:title" content="7 Fatal Startup Branding Mistakes That Kill Growth" />
        <meta property="og:description" content="Avoid the branding pitfalls that kill 90% of startups. Includes free brand audit checklist and real case studies." />
        <meta property="og:url" content="https://bttr-ai.com/blog/startup-branding-mistakes-avoid" />
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
        {/* Floating Navigation Header - EXACT COPY FROM HOMEPAGE */}
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


        {/* Mobile Navigation Header - EXACT COPY FROM HOMEPAGE */}
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

        {/* Mobile Menu Dropdown - EXACT COPY FROM HOMEPAGE */}
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

        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px 80px' }}>
          <header style={{ marginBottom: '48px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              lineHeight: '1.2',
              marginBottom: '24px'
            }}>
              7 Fatal Startup Branding Mistakes That Kill Growth (And How to Fix Them)
            </h1>
            
            <p style={{ 
              fontSize: '20px', 
              color: '#ccc', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              90% of startups fail, and poor branding is often a contributing factor. Avoid these critical mistakes that can sink your startup before it even gets started.
            </p>
          </header>

          <div style={{ fontSize: '18px', lineHeight: '1.7', color: '#e5e5e5' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #1: No Clear Brand Strategy Foundation
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Many startups jump straight into logo design without defining their brand strategy first.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> Without a clear brand foundation, every marketing decision becomes a guess. Your messaging is inconsistent, your visual identity lacks purpose, and customers can't understand what you stand for.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Before designing anything, define your brand purpose, values, personality, and positioning. This foundation will guide every brand decision moving forward.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #2: Trying to Appeal to Everyone
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Startups often try to cast the widest possible net to maximize their addressable market.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> When you try to appeal to everyone, you appeal to no one. Your messaging becomes generic and forgettable.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Define a specific target audience and speak directly to them. You can always expand later, but you need to win your core audience first.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #3: Inconsistent Visual Identity
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Using different fonts, colors, and styles across different touchpoints because you're moving fast and "perfecting" later.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> Inconsistency breeds distrust. Customers begin to question your professionalism and attention to detail.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Create basic brand guidelines early. Even simple rules about fonts, colors, and logo usage will dramatically improve your brand consistency.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #4: Ignoring Competitor Analysis
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Focusing so intensely on your product that you ignore what competitors are doing in the market.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> You may accidentally position yourself too similarly to competitors or miss opportunities to differentiate.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Regularly analyze competitor positioning, messaging, and visual identity. Look for gaps in the market where you can own unique territory.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #5: DIY Everything Without Strategy
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Using free logo generators, stock templates, and generic messaging to save money.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> Your brand looks exactly like every other startup. You blend into the noise instead of standing out.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Invest in strategic brand development early. Even a modest investment in professional branding pays massive dividends in customer perception and business growth.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #6: No Brand Voice Guidelines
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Every team member communicates differently, creating a disjointed brand experience.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> Customers get confused messages and can't form a clear impression of your brand personality.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Define your brand voice and create simple guidelines that anyone on your team can follow. Include tone, language preferences, and examples.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              Mistake #7: Not Testing Brand Decisions
            </h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>The Problem:</strong> Making brand decisions in a vacuum without testing them with real customers or stakeholders.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why It's Fatal:</strong> You may be completely off-base with your target audience's preferences and needs.
            </p>
            <p style={{ marginBottom: '24px' }}>
              <strong>The Fix:</strong> Test key brand elements with your target audience before finalizing them. Simple surveys or interviews can save you from expensive mistakes.
            </p>

            <h2 style={{ fontSize: '32px', fontWeight: '600', marginTop: '48px', marginBottom: '24px', color: '#fff' }}>
              The Startup Brand Success Framework
            </h2>
            <p style={{ marginBottom: '20px' }}>
              Instead of making these mistakes, follow this proven framework:
            </p>
            <ol style={{ marginBottom: '24px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>Define your brand strategy foundation first</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Research your target audience and competitors</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Create consistent visual identity guidelines</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Develop clear brand voice and messaging</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Test key decisions with real users</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Implement consistently across all touchpoints</strong></li>
              <li style={{ marginBottom: '12px' }}><strong>Monitor and refine based on feedback</strong></li>
            </ol>
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
              Avoid These Mistakes in Your Startup
            </h3>
            <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '32px' }}>
              Get a free brand audit from our AI strategist, or book a consultation to develop a winning brand strategy for your startup.
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
                Get Free Brand Audit
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