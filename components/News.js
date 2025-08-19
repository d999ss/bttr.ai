import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const newsItems = [
  {
    id: 'brand-transformation-2025',
    title: 'How to Transform Your Brand in 2025',
    date: 'Aug 2024',
    category: 'Brand Strategy Guide',
    description: 'Complete guide to brand transformation using our proven 7-step framework. Includes case studies from Ikon Pass, Air Company & GE.',
    link: '/blog/how-to-transform-your-brand-in-2025',
    isInternal: true,
    seo: true
  },
  {
    id: 'ai-brand-strategy-future',
    title: 'AI-Powered Brand Strategy Revolution',
    date: 'Aug 2024',
    category: 'Innovation',
    description: 'How AI is transforming brand strategy and helping companies achieve 300% growth. Get insights from our AI brand strategist.',
    link: '/blog/ai-powered-brand-strategy-future',
    isInternal: true,
    seo: true
  },
  {
    id: 'startup-branding-mistakes',
    title: '7 Fatal Startup Branding Mistakes',
    date: 'Aug 2024',
    category: 'Startup Guide',
    description: 'Avoid the branding pitfalls that kill 90% of startups. Includes free brand audit checklist and real case studies.',
    link: '/blog/startup-branding-mistakes-avoid',
    isInternal: true,
    seo: true
  },
  {
    id: 'opendoor',
    title: 'Opendoor appoint Bttr.',
    date: 'Jul 2025',
    category: 'News',
    description: 'Partnering with Opendoor on their next phase of growth and digital transformation.',
    link: 'https://www.makebttr.com/news/opendoor-appoint-bttr/'
  },
  {
    id: 'ai-car',
    title: 'AI Generated Concept Car Brand',
    date: 'Dec 2024',
    category: 'Creative Innovation',
    description: 'Pushing creative boundaries with an AI-generated automotive design concept.',
    link: 'https://www.makebttr.com/news/enhancing-a-prototype-with-an-ai-generated-concept-car-brand/'
  },
  {
    id: 'rebuilding-tomorrow',
    title: 'Rebuilding Tomorrow',
    date: 'Jan 2025',
    category: 'Creative Innovation',
    description: 'Crafting the future with smarter tools and sustainable AI approaches.',
    link: 'https://www.makebttr.com/news/powering-tomorrow-how-smart-tools-are-building-a-sustainable-ai-future/'
  },
  {
    id: 'founder-mode',
    title: 'Founder Mode + Taste',
    date: 'Sep 2024',
    category: 'Creative Innovation',
    description: 'How culture is eating technology and why taste matters more than ever.',
    link: 'https://www.makebttr.com/news/founder-mode-taste-how-culture-is-eating-technology/'
  },
  {
    id: 'nike-analysis',
    title: "Nike's Unforced Error",
    date: 'Aug 2024',
    category: 'News',
    description: 'Our analysis on when the numbers don\'t add up in brand strategy.',
    link: 'https://www.makebttr.com/news/nikes-unforced-error/'
  },
  {
    id: 'figma-config',
    title: 'Figma Config 2024',
    date: 'Jun 2024',
    category: 'News',
    description: 'A paradigm shift in design tools and what it means for the industry.',
    link: 'https://www.makebttr.com/news/figma-config-2024-a-paradigm-shift/'
  },
  {
    id: 'alterra',
    title: 'Alterra Partnership',
    date: 'Jun 2024',
    category: 'Product Design',
    description: 'Elevating digital design for millions of skiers worldwide.',
    link: 'https://www.makebttr.com/news/alterra-tap-bttr-to-elevate-digital-design/'
  },
  {
    id: 'ge-vernova',
    title: 'GE Vernova',
    date: 'Sep 2023',
    category: 'Case Study',
    description: 'Presenting complex systems with clarity to inspire investor confidence.',
    link: 'https://www.makebttr.com/news/ge-vernova-complex-systems/'
  }
]

export default function News({ onNewsClick }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  const handleItemClick = (item) => {
    if (item.isInternal) {
      // For internal blog posts, navigate to the page
      router.push(item.link)
    } else {
      // For external links, use the existing onNewsClick handler
      onNewsClick(item)
    }
  }
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: isMobile ? '12px' : '20px',
      marginTop: isMobile ? '16px' : '20px',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      {newsItems.map((item) => (
        <div 
          key={item.id}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{ 
            backgroundColor: hoveredItem === item.id ? '#1a1a1a' : '#0d0d0d',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: isMobile ? '16px' : '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredItem === item.id ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredItem === item.id ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <span style={{ 
              color: item.seo ? '#007AFF' : '#666',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: item.seo ? '600' : 'normal'
            }}>
              {item.category} {item.seo ? '•' : ''}
            </span>
            <span style={{ 
              color: '#666',
              fontSize: '11px'
            }}>
              {item.date}
            </span>
          </div>
          
          <h3 style={{ 
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px',
            lineHeight: '1.3'
          }}>
            {item.title}
          </h3>
          
          <p style={{ 
            color: '#999',
            fontSize: '13px',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}>
            {item.description}
          </p>
          
          <div style={{ 
            color: hoveredItem === item.id ? '#FFFFFF' : '#666',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.3s ease'
          }}>
            Read more →
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}