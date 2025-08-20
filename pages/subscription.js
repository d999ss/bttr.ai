import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function Subscription() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [showNews, setShowNews] = useState(false)
  
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

  return (
    <>
      <Head>
        <title>Bttr. Subscription | World-Class Design On Demand</title>
        <meta name="description" content="Transform your brand with our subscription model. $14,995/month for unlimited design projects, 48-hour turnaround, and senior-level creative. No contracts, pause anytime." />
        <meta name="keywords" content="design subscription, brand design service, unlimited design, monthly design service, startup design, enterprise design" />
        <link rel="canonical" href="https://bttr-ai.com/subscription" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Bttr. Subscription | World-Class Design On Demand" />
        <meta property="og:description" content="Get unlimited design projects with 48-hour turnaround for one flat monthly rate. Senior-level creative, no contracts." />
        <meta property="og:url" content="https://bttr-ai.com/subscription" />
        <meta property="og:type" content="website" />
        
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
          
          .pricing-card {
            transition: all 0.3s ease;
          }
          
          .pricing-card:hover {
            transform: translateY(-8px);
          }
          
          .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }
          
          @media (max-width: 768px) {
            .feature-grid {
              grid-template-columns: 1fr;
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
          handleNameClick={handleNameClick}
          trackEngagement={trackEngagement}
          append={append}
          onProjectClick={handleProjectClick}
          onNewsClick={handleNewsClick}
        />

        {/* Hero Section */}
        <section style={{ 
          padding: '140px 20px 80px', 
          textAlign: 'center', 
          maxWidth: '1200px', 
          margin: '0 auto',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              New Launch
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(48px, 8vw, 72px)', 
            fontWeight: '700', 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B0B0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1'
          }}>
            Bttr. Subscription
          </h1>
          
          <p style={{ 
            fontSize: '24px', 
            color: '#888', 
            lineHeight: '1.5',
            maxWidth: '800px',
            margin: '0 auto 40px',
            fontWeight: '400'
          }}>
            A new way to work with world-class design and product minds. No bloated retainers, no endless SOWs—just focused, high-velocity output.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Start Your Trial
            </button>
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
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              See Examples
            </button>
          </div>
        </section>

        {/* Pricing Section */}
        <section style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#fff'
            }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: '20px', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
              Choose the plan that matches your velocity. Pause or cancel anytime.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '32px',
            marginBottom: '40px'
          }}>
            {/* Core Plan */}
            <div className="pricing-card" style={{
              background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
              border: '1px solid rgba(0,122,255,0.3)',
              borderRadius: '16px',
              padding: '40px 32px',
              position: 'relative'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#007AFF' }}>
                  Core Plan
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>$14,995</span>
                  <span style={{ color: '#888', fontSize: '18px' }}>/month</span>
                </div>
                <p style={{ color: '#ccc', fontSize: '16px', lineHeight: '1.5' }}>
                  Everything you need to transform your brand and digital products, delivered fast and with zero friction.
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                {[
                  'One active request at a time',
                  '48-hour average turnaround',
                  'Unlimited projects and brands',
                  'Webflow development included',
                  'Unlimited stock photography',
                  'Up to 2 team members per subscription',
                  'Unlimited revisions until it\'s right',
                  'Pause or cancel anytime—unused days roll forward',
                  'One-week trial with 75% refund if not a fit'
                ].map((feature, index) => (
                  <li key={index} style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    color: '#e5e5e5'
                  }}>
                    <span style={{ color: '#007AFF', fontSize: '16px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Start Core Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card" style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '40px 32px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Most Popular
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#FFD700' }}>
                  Pro Plan
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>$17,995</span>
                  <span style={{ color: '#888', fontSize: '18px' }}>/month</span>
                </div>
                <p style={{ color: '#ccc', fontSize: '16px', lineHeight: '1.5' }}>
                  For teams moving at full speed.
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                {[
                  'Two active requests at once',
                  'Unlimited projects and brands',
                  'Unlimited users',
                  'All features of the Core Plan'
                ].map((feature, index) => (
                  <li key={index} style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    color: '#e5e5e5'
                  }}>
                    <span style={{ color: '#FFD700', fontSize: '16px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Start Pro Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card" style={{
              background: 'linear-gradient(135deg, rgba(139,69,196,0.1) 0%, rgba(88,28,135,0.1) 100%)',
              border: '1px solid rgba(139,69,196,0.3)',
              borderRadius: '16px',
              padding: '40px 32px',
              position: 'relative'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#8B45C4' }}>
                  Enterprise
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>$25,000+</span>
                  <span style={{ color: '#888', fontSize: '18px' }}>/month</span>
                </div>
                <p style={{ color: '#ccc', fontSize: '16px', lineHeight: '1.5' }}>
                  For organizations requiring maximum throughput and dedicated support.
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                {[
                  'Dedicated design team',
                  'Custom SLA and turnaround times',
                  'White-glove onboarding',
                  'Priority support channel',
                  'Custom integrations',
                  'All Pro Plan features'
                ].map((feature, index) => (
                  <li key={index} style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    color: '#e5e5e5'
                  }}>
                    <span style={{ color: '#8B45C4', fontSize: '16px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8B45C4 0%, #581C87 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#fff'
            }}>
              How It Works
            </h2>
            <p style={{ fontSize: '20px', color: '#888', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
              Three simple steps to transform your brand at lightning speed.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '40px'
            }}>
              {[
                {
                  step: '01',
                  title: 'Subscribe',
                  description: 'Flat monthly rate, no surprises. Choose your plan and get instant access to your personal Bttr. board.'
                },
                {
                  step: '02', 
                  title: 'Request',
                  description: 'Add projects via your board. From full apps to quick ads, just drop in what you need with clear briefs.'
                },
                {
                  step: '03',
                  title: 'Receive',
                  description: 'Get polished deliverables in as little as 48 hours. Revise until perfect, then move to your next project.'
                }
              ].map((item, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '32px 24px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '16px' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Deliver */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#fff'
            }}>
              What We Deliver
            </h2>
            <p style={{ fontSize: '20px', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
              Senior-level creative across every touchpoint your brand needs.
            </p>
          </div>

          <div className="feature-grid">
            {[
              'Digital products & web apps',
              'Mobile apps',
              'Logos & branding systems',
              'Marketing sites (Webflow)',
              'Pitch decks & presentations',
              'Social media & ad creative',
              'Packaging & print',
              'UI/UX across platforms'
            ].map((item, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Why Bttr */}
        <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                marginBottom: '16px',
                color: '#fff'
              }}>
                Why Bttr.
              </h2>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '32px'
            }}>
              {[
                {
                  title: 'Senior-level creative, every time',
                  description: 'No juniors, no outsourcing. Every project handled by experienced design leaders.'
                },
                {
                  title: 'Predictable cost structure', 
                  description: 'One flat monthly fee. No hourly rates, no scope creep, no surprise invoices.'
                },
                {
                  title: 'Velocity that matches your ambition',
                  description: '48-hour average turnaround means you ship faster than your competition.'
                },
                {
                  title: 'Built for scale',
                  description: 'Start, pause, or ramp instantly. Perfect for growing teams and changing priorities.'
                },
                {
                  title: 'Original design, no templates',
                  description: 'Every piece of work is custom-created for your brand. No cookie-cutter solutions.'
                }
              ].map((item, index) => (
                <div key={index} style={{
                  padding: '32px 24px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#007AFF' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '16px' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof & Trust */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#fff'
            }}>
              Proof & Trust
            </h2>
            <p style={{ fontSize: '20px', color: '#888', maxWidth: '800px', margin: '0 auto' }}>
              Bttr. partners with category leaders (GE, Alterra, Allergan Aesthetics). Recognized for shaping the future of design + AI product experiences.
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap',
            opacity: 0.6,
            marginBottom: '60px'
          }}>
            {['GE', 'Alterra', 'Allergan Aesthetics', 'Ikon Pass', 'Air Company'].map((client, index) => (
              <div key={index} style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#666',
                letterSpacing: '2px'
              }}>
                {client}
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(0,122,255,0.2)',
            borderRadius: '16px',
            padding: '48px 32px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '24px' }}>
              Ready to Transform Your Brand?
            </h3>
            <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '32px' }}>
              Join the brands that trust Bttr. for world-class design. Start your trial today.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                Start Your Trial
              </button>
              <Link href="https://calendly.com/d999ss-rvyb" style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block'
              }}>
                Book a Call
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}