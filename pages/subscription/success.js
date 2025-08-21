import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'

export default function SubscriptionSuccess() {
  const router = useRouter()
  const { session_id } = router.query
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const handleNameClick = () => {
    window.location.href = '/'
  }
  
  const trackEngagement = (event, action) => {
    console.log('Track engagement:', event, action)
  }
  
  const append = (message) => {
    console.log('Would append message:', message)
    window.location.href = '/'
  }
  
  const handleProjectClick = (project) => {
    console.log('Project clicked:', project)
    window.location.href = '/'
  }
  
  const handleNewsClick = (newsItem) => {
    console.log('News clicked:', newsItem)
    window.location.href = '/'
  }

  const handleSubscriptionAction = (plan) => {
    console.log('Subscription action:', plan)
  }

  useEffect(() => {
    if (session_id) {
      // Here you would typically verify the session with Stripe
      // For now, we'll just simulate success
      setLoading(false)
      setSession({ status: 'complete' })
    }
  }, [session_id])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Subscription Success | Welcome to Bttr.</title>
        <meta name="description" content="Welcome to Bttr. Your subscription is now active and you're ready to transform your brand." />
        <style jsx global>{`
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
          
          @media (min-width: 1025px) {
            .mobile-show {
              display: none !important;
            }
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
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
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
        <Navigation 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          showPortfolio={showPortfolio}
          setShowPortfolio={setShowPortfolio}
          showNews={showNews}
          setShowNews={setShowNews}
          showSubscription={showSubscription}
          setShowSubscription={setShowSubscription}
          handleNameClick={handleNameClick}
          trackEngagement={trackEngagement}
          append={append}
          onProjectClick={handleProjectClick}
          onNewsClick={handleNewsClick}
          onSubscriptionAction={handleSubscriptionAction}
        />

        {/* Success Content */}
        <main 
          id="page"
          style={{
            paddingTop: 'calc(var(--nav-h, 96px) + env(safe-area-inset-top) + 40px)',
            paddingBottom: '80px'
          }}
        >
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(0,122,255,0.3)',
            borderRadius: '16px',
            padding: '64px 48px',
            marginBottom: '48px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '32px'
            }}>
              ✓
            </div>
            
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: '700',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #B0B0B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome to Bttr.
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#ccc',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Your subscription is now active! We're excited to help you transform your brand with world-class design and strategy.
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#007AFF',
                marginBottom: '16px'
              }}>
                What happens next?
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {[
                  'You\'ll receive a welcome email with your project board access',
                  'Our team will reach out within 24 hours to onboard you',
                  'Start submitting your first design requests immediately',
                  'Get your first deliverables within 48 hours'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    fontSize: '16px',
                    color: '#e5e5e5'
                  }}>
                    <span style={{ color: '#007AFF', fontSize: '16px', width: '20px' }}>
                      {index + 1}.
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/" style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}>
                Start Chatting
              </Link>
              <button style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                // This would open the customer portal
                window.open('mailto:hello@makebttr.com?subject=Subscription Support', '_blank')
              }}>
                Contact Support
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p>
              Need help getting started? Email us at{' '}
              <a href="mailto:hello@makebttr.com" style={{ color: '#007AFF', textDecoration: 'none' }}>
                hello@makebttr.com
              </a>
            </p>
          </div>
          </div>
        </main>
      </div>
    </>
  )
}