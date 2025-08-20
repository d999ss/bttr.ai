import { useState, useEffect } from 'react'

const plans = [
  {
    id: 'core',
    name: 'Core Plan',
    price: '$14,995',
    period: '/month',
    popular: false,
    description: 'Everything you need to transform your brand and digital products, delivered fast and with zero friction.',
    features: [
      'One active request at a time',
      '48-hour average turnaround',
      'Unlimited projects and brands',
      'Webflow development included',
      'Unlimited stock photography',
      'Up to 2 team members per subscription',
      'Unlimited revisions until it\'s right',
      'Pause or cancel anytime—unused days roll forward',
      'One-week trial with 75% refund if not a fit'
    ],
    color: '#007AFF',
    gradient: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
    border: 'rgba(0,122,255,0.3)',
    priceId: 'price_core_plan', // Replace with actual Stripe price ID
    stripeLink: 'https://buy.stripe.com/test_core_plan' // Replace with actual Stripe link
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '$17,995',
    period: '/month',
    popular: true,
    description: 'For teams moving at full speed.',
    features: [
      'Two active requests at once',
      'Unlimited projects and brands',
      'Unlimited users',
      'All features of the Core Plan'
    ],
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)',
    border: '#FFD700',
    priceId: 'price_pro_plan', // Replace with actual Stripe price ID
    stripeLink: 'https://buy.stripe.com/test_pro_plan' // Replace with actual Stripe link
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$25,000+',
    period: '/month',
    popular: false,
    description: 'For organizations requiring maximum throughput and dedicated support.',
    features: [
      'Dedicated design team',
      'Custom SLA and turnaround times',
      'White-glove onboarding',
      'Priority support channel',
      'Custom integrations',
      'All Pro Plan features'
    ],
    color: '#8B45C4',
    gradient: 'linear-gradient(135deg, rgba(139,69,196,0.1) 0%, rgba(88,28,135,0.1) 100%)',
    border: 'rgba(139,69,196,0.3)',
    priceId: 'price_enterprise_plan', // Replace with actual Stripe price ID
    stripeLink: 'mailto:hello@makebttr.com?subject=Enterprise%20Plan%20Inquiry' // Contact for enterprise
  }
]

const deliverables = [
  'Digital products & web apps',
  'Mobile apps',
  'Logos & branding systems',
  'Marketing sites (Webflow)',
  'Pitch decks & presentations',
  'Social media & ad creative',
  'Packaging & print',
  'UI/UX across platforms'
]

const whyPoints = [
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
  }
]

export default function Subscription({ onSubscriptionAction }) {
  const [hoveredPlan, setHoveredPlan] = useState(null)
  const [hoveredDeliverable, setHoveredDeliverable] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState('')
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCheckout = async (plan) => {
    if (plan.id === 'enterprise') {
      // Enterprise plan redirects to contact
      window.open(plan.stripeLink, '_blank')
      return
    }

    setLoading(plan.id)
    
    try {
      // For demo purposes, we'll use the stripeLink directly
      // In production, you'd create a checkout session via your API
      
      // Option 1: Direct Stripe link (for quick setup)
      if (plan.stripeLink) {
        window.open(plan.stripeLink, '_blank')
        setLoading('')
        return
      }
      
      // Option 2: Custom checkout session (for full control)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
        }),
      })
      
      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading('')
    }
  }

  return (
    <div style={{
      marginTop: isMobile ? '0px' : '0px',
      marginBottom: isMobile ? '40px' : '120px',
      paddingBottom: isMobile ? '20px' : '80px',
      marginLeft: isMobile ? '0px' : '0px',
      marginRight: isMobile ? '0px' : '0px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            New Launch
          </span>
        </div>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: isMobile ? '8px' : '12px',
          color: '#FFFFFF',
          letterSpacing: '-0.3px'
        }}>
          Bttr. Subscription
        </h2>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: 0,
          lineHeight: '1.4'
        }}>
          A new way to work with world-class design minds. No bloated retainers, no endless SOWs—just focused, high-velocity output.
        </p>
      </div>

      {/* Pricing Plans */}
      <div style={{
        display: 'grid',
        gap: isMobile ? '12px' : '16px',
        marginBottom: isMobile ? '24px' : '32px'
      }}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handleCheckout(plan)}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            style={{
              background: hoveredPlan === plan.id ? plan.gradient : 'transparent',
              border: `1px solid ${hoveredPlan === plan.id ? plan.border : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              padding: isMobile ? '16px' : '20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              fontFamily: 'inherit',
              position: 'relative',
              overflow: 'hidden'
            }}
            aria-label={`Select ${plan.name}`}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: plan.color,
                color: plan.id === 'pro' ? '#000' : '#fff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '9px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                Popular
              </div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: plan.color,
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {plan.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {plan.period}
                  </span>
                </div>
              </div>
            </div>
            
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              marginBottom: '12px',
              lineHeight: '1.4'
            }}>
              {plan.description}
            </p>

            {/* Features */}
            <div style={{
              display: 'grid',
              gap: '4px'
            }}>
              {plan.features.slice(0, isMobile ? 3 : 4).map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    color: plan.color, 
                    fontSize: '10px',
                    width: '8px',
                    flexShrink: 0
                  }}>
                    ✓
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.3'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
              {plan.features.length > (isMobile ? 3 : 4) && (
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '4px'
                }}>
                  +{plan.features.length - (isMobile ? 3 : 4)} more features
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: isMobile ? '12px' : '16px',
          color: '#FFFFFF',
          letterSpacing: '-0.3px'
        }}>
          How It Works
        </h3>
        
        <div style={{
          display: 'grid',
          gap: isMobile ? '8px' : '12px'
        }}>
          {[
            { step: '01', title: 'Subscribe', description: 'Flat monthly rate, no surprises.' },
            { step: '02', title: 'Request', description: 'Add projects via your board.' },
            { step: '03', title: 'Receive', description: 'Get deliverables in 48 hours.' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: isMobile ? '12px' : '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '600',
                color: 'white',
                flexShrink: 0
              }}>
                {item.step}
              </div>
              <div>
                <h4 style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What We Deliver */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: isMobile ? '12px' : '16px',
          color: '#FFFFFF',
          letterSpacing: '-0.3px'
        }}>
          What We Deliver
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: isMobile ? '8px' : '12px'
        }}>
          {deliverables.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredDeliverable(index)}
              onMouseLeave={() => setHoveredDeliverable(null)}
              style={{
                background: hoveredDeliverable === index ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: isMobile ? '8px' : '12px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
            >
              <span style={{
                fontSize: '10px',
                fontWeight: '500',
                color: '#FFFFFF',
                lineHeight: '1.3'
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Why Bttr */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: isMobile ? '12px' : '16px',
          color: '#FFFFFF',
          letterSpacing: '-0.3px'
        }}>
          Why Bttr.
        </h3>
        
        <div style={{
          display: 'grid',
          gap: isMobile ? '8px' : '12px'
        }}>
          {whyPoints.map((point, index) => (
            <div key={index} style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: isMobile ? '12px' : '16px'
            }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: '500',
                color: '#007AFF',
                margin: 0,
                marginBottom: '4px'
              }}>
                {point.title}
              </h4>
              <p style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: isMobile ? '16px' : '20px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#FFFFFF',
          margin: 0,
          marginBottom: '8px'
        }}>
          Trusted by Category Leaders
        </h3>
        <p style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: 0,
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          GE, Alterra, Allergan Aesthetics, Ikon Pass, Air Company
        </p>
        
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => handleCheckout(plans[0])} // Default to Core plan for trial
            disabled={loading === plans[0].id}
            style={{
              background: loading === plans[0].id ? 'rgba(0,122,255,0.5)' : 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              fontSize: '10px',
              cursor: loading === plans[0].id ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}>
            {loading === plans[0].id ? 'Loading...' : 'Start Trial'}
          </button>
          <button 
            onClick={() => window.open('https://calendly.com/d999ss-rvyb', '_blank')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: '500',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            Book Call
          </button>
        </div>
      </div>
    </div>
  )
}