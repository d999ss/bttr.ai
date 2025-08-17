import { useState, useEffect } from 'react'

const projects = [
  {
    id: 1,
    name: 'JUVÉDERM',
    role: 'Product Design Lead',
    description: 'Enhancing engagement for a leading aesthetic brand',
    tags: ['Healthcare', 'Product Design', 'Brand Strategy'],
    year: '2024',
    image: 'https://www.makebttr.com/content/uploads/2025/04/Thumbnail-1600x1600.jpg'
  },
  {
    id: 2,
    name: 'BOTOX Cosmetic',
    role: 'UX Strategy',
    description: 'Strengthening product recognition and loyalty across a market leader',
    tags: ['Healthcare', 'Consumer Experience', 'Digital Strategy'],
    year: '2024',
    image: 'https://www.makebttr.com/content/uploads/2025/04/Featured-image-1600x1600.jpg'
  },
  {
    id: 3,
    name: 'AMI',
    role: 'Product Strategy',
    description: 'Improving the user experience and product strategy for a learning platform',
    tags: ['EdTech', 'UX Design', 'Platform Strategy'],
    year: '2023',
    image: 'https://www.makebttr.com/content/uploads/2025/03/20211133-1600x1024.jpg'
  },
  {
    id: 4,
    name: 'Revaire',
    role: 'Brand Design',
    description: 'A modern, luxurious identity',
    tags: ['Branding', 'Luxury', 'Visual Identity'],
    year: '2023',
    image: 'https://www.makebttr.com/content/uploads/2024/08/SQ-Image-frame-4.jpg'
  },
  {
    id: 5,
    name: 'Air Company',
    role: 'Creative Director',
    description: 'Shaping a startup around groundbreaking carbon technology',
    tags: ['Sustainability', 'Brand Strategy', 'Startup'],
    year: '2022',
    image: 'https://www.makebttr.com/content/uploads/2023/09/AirCo-HS-1-1-1_00000.png'
  },
  {
    id: 6,
    name: 'FleetPulse',
    role: 'Product Design',
    description: 'Smart-Trailer innovation, designed for a more efficient future',
    tags: ['IoT', 'Transportation', 'Product Innovation'],
    year: '2022',
    image: 'https://www.makebttr.com/content/uploads/2024/06/Fleetpulse_Thumb.jpg'
  },
  {
    id: 7,
    name: 'Allē For Business',
    role: 'Platform Architecture',
    description: 'Empowering healthcare practices to manage, grow, and scale',
    tags: ['Healthcare', 'B2B Platform', 'SaaS'],
    year: '2021',
    image: 'https://www.makebttr.com/content/uploads/2024/03/Desktop-6-1600x1002.jpg'
  },
  {
    id: 8,
    name: 'Allē For Consumers',
    role: 'Consumer Experience Lead',
    description: 'A simple, modern, and engaging consumer loyalty program',
    tags: ['Consumer App', 'Loyalty Program', 'Mobile Design'],
    year: '2021',
    image: 'https://www.makebttr.com/content/uploads/2024/03/Desktop-1600x1006.jpg'
  },
  {
    id: 9,
    name: 'Ciitizen',
    role: 'Product Design',
    description: 'Turning one brother\'s dream into a reality',
    tags: ['Healthcare', 'Data Platform', 'Social Impact'],
    year: '2020'
  },
  {
    id: 10,
    name: 'Helix',
    role: 'Brand Architecture',
    description: 'One brand three sectors – Securities, Carbon Assets, and Real Estate',
    tags: ['FinTech', 'Multi-sector', 'Brand System'],
    year: '2020'
  },
  {
    id: 11,
    name: 'IKON Pass',
    role: 'Lead Product Designer',
    description: 'Redesigned the digital experience for millions of skiers worldwide',
    tags: ['Product Design', 'Mobile App', 'Web Platform'],
    year: '2019'
  },
  {
    id: 12,
    name: 'GE Healthcare',
    role: 'Design System Lead',
    description: 'Built a comprehensive design system for medical AI applications',
    tags: ['Design Systems', 'Healthcare', 'AI/ML'],
    year: '2019'
  },
  {
    id: 13,
    name: 'Dollar Shave Club',
    role: 'Product Design',
    description: 'Enhanced e-commerce experience for millions of subscribers',
    tags: ['E-commerce', 'Subscription', 'Consumer Product'],
    year: '2018'
  },
  {
    id: 14,
    name: 'PepsiCo',
    role: 'Digital Strategy',
    description: 'Global campaign and digital transformation initiatives',
    tags: ['FMCG', 'Campaign', 'Digital Strategy'],
    year: '2018'
  },
  {
    id: 15,
    name: 'GE Brilliant You',
    role: 'Creative Direction',
    description: 'Innovative employee engagement platform',
    tags: ['Enterprise', 'HR Tech', 'Platform Design'],
    year: '2017'
  },
  {
    id: 16,
    name: 'Adidas',
    role: 'Interactive Design',
    description: 'Digital retail experiences and product launches',
    tags: ['Retail', 'Sports', 'Interactive'],
    year: '2017'
  },
  {
    id: 17,
    name: 'Nissan Motor Co.',
    role: 'Digital Design',
    description: 'Automotive digital showroom and configurator',
    tags: ['Automotive', 'Digital Retail', '3D'],
    year: '2016'
  },
  {
    id: 18,
    name: 'Visa',
    role: 'UX Design',
    description: 'Payment platform interfaces and merchant tools',
    tags: ['FinTech', 'Payments', 'B2B'],
    year: '2016'
  }
]

export default function Portfolio({ onProjectClick }) {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  
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
      marginTop: isMobile ? '24px' : '48px',
      marginBottom: isMobile ? '40px' : '120px',
      paddingBottom: isMobile ? '20px' : '80px',
      marginLeft: isMobile ? '0px' : '0px',
      marginRight: isMobile ? '0px' : '0px'
    }}>
      <h2 style={{
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: isMobile ? '16px' : '24px',
        color: '#FFFFFF',
        letterSpacing: '-0.3px'
      }}>
        Selected Work
      </h2>
      
      <div style={{
        display: 'grid',
        gap: isMobile ? '12px' : '16px'
      }}>
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(project)}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{
              background: hoveredProject === project.id ? '#1a1a1a' : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              fontFamily: 'inherit',
              overflow: 'hidden'
            }}
            aria-label={`View ${project.name} project details`}
          >
            {/* Project Image */}
            {project.image && (
              <div style={{
                width: '100%',
                height: isMobile ? '120px' : '140px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '12px',
                background: '#0a0a0a'
              }}>
                <img 
                  src={project.image}
                  alt={`${project.name} project preview`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease',
                    transform: hoveredProject === project.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                  loading="lazy"
                />
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
                  color: '#FFFFFF',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {project.name}
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0
                }}>
                  {project.role} • {project.year}
                </p>
              </div>
              <span style={{
                fontSize: '11px',
                color: hoveredProject === project.id ? '#38FE27' : 'rgba(255, 255, 255, 0.4)',
                transition: 'color 0.2s ease'
              }}>
                →
              </span>
            </div>
            
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '8px 0',
              lineHeight: '1.4'
            }}>
              {project.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}