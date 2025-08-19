import Head from 'next/head'
import Link from 'next/link'

const blogPosts = [
  {
    slug: 'how-to-transform-your-brand-in-2025',
    title: 'How to Transform Your Brand in 2025: A Complete Guide',
    excerpt: 'Discover the proven 7-step process we used to transform brands like Ikon Pass and Air Company. Learn how to position your brand for explosive growth.',
    date: '2024-08-19',
    readTime: '8 min read',
    category: 'Brand Strategy',
    keywords: 'brand transformation, brand strategy, brand positioning, brand refresh'
  },
  {
    slug: 'ai-powered-brand-strategy-future',
    title: 'The Future of Brand Strategy: How AI is Revolutionizing Business Growth',
    excerpt: 'See how AI-powered brand strategy helped our clients achieve 300% growth. Get insights from our AI brand strategist and book a consultation.',
    date: '2024-08-18',
    readTime: '6 min read', 
    category: 'Innovation',
    keywords: 'AI brand strategy, artificial intelligence branding, brand innovation'
  },
  {
    slug: 'startup-branding-mistakes-avoid',
    title: '7 Fatal Startup Branding Mistakes That Kill Growth (And How to Fix Them)',
    excerpt: 'Avoid the branding pitfalls that sink 90% of startups. Learn from real case studies and get our free brand audit checklist.',
    date: '2024-08-17',
    readTime: '10 min read',
    category: 'Startup Branding',
    keywords: 'startup branding, brand mistakes, startup marketing, brand audit'
  },
  {
    slug: 'enterprise-brand-transformation-case-study',
    title: 'Enterprise Brand Transformation: How We Helped GE Modernize Their Identity',
    excerpt: 'Inside look at our enterprise branding process. See how we transformed a Fortune 500 brand and generated $50M+ in new business.',
    date: '2024-08-16',
    readTime: '12 min read',
    category: 'Case Studies',
    keywords: 'enterprise branding, brand transformation, GE case study, corporate branding'
  },
  {
    slug: 'brand-positioning-framework-2025',
    title: 'The Ultimate Brand Positioning Framework for 2025',
    excerpt: 'Our proprietary 5-step framework for killer brand positioning. Used by 100+ successful brands to dominate their markets.',
    date: '2024-08-15',  
    readTime: '9 min read',
    category: 'Brand Strategy',
    keywords: 'brand positioning, positioning framework, competitive positioning'
  }
]

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Brand Strategy Blog | Expert Insights from Bttr. Agency</title>
        <meta name="description" content="Expert brand strategy insights, case studies, and guides from Bttr. agency. Learn how to transform your brand with proven frameworks and real success stories." />
        <meta name="keywords" content="brand strategy blog, branding insights, brand transformation guide, startup branding, enterprise branding" />
        <link rel="canonical" href="https://bttr-ai.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Brand Strategy Blog | Expert Insights from Bttr." />
        <meta property="og:description" content="Expert brand strategy insights and case studies. Learn how to transform your brand with proven frameworks." />
        <meta property="og:url" content="https://bttr-ai.com/blog" />
        <meta property="og:type" content="website" />
      </Head>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Navigation */}
        <nav style={{ 
          padding: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            fontSize: '18px', 
            fontWeight: '600' 
          }}>
            ← Back to Bttr.
          </Link>
          <Link href="/blog" style={{ 
            color: '#007AFF', 
            textDecoration: 'none', 
            fontSize: '16px' 
          }}>
            Blog
          </Link>
        </nav>

        {/* Header */}
        <header style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Brand Strategy Insights
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#888', 
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Expert insights, case studies, and proven frameworks from the team that transformed brands like Ikon Pass, Air Company, and GE.
          </p>
        </header>

        {/* Blog Posts */}
        <main style={{ padding: '0 20px 80px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '40px' }}>
            {blogPosts.map((post) => (
              <article key={post.slug} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '32px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(0,122,255,0.2)',
                    color: '#60a5fa',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {post.category}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px' }}>{post.date}</span>
                  <span style={{ color: '#666', fontSize: '14px' }}>•</span>
                  <span style={{ color: '#666', fontSize: '14px' }}>{post.readTime}</span>
                </div>
                
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h2>
                
                <p style={{ 
                  color: '#ccc', 
                  lineHeight: '1.6', 
                  fontSize: '16px',
                  marginBottom: '20px'
                }}>
                  {post.excerpt}
                </p>
                
                <Link href={`/blog/${post.slug}`} style={{
                  color: '#007AFF',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  Read Full Article →
                </Link>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(0,122,255,0.2)',
            borderRadius: '16px',
            padding: '48px 32px',
            textAlign: 'center',
            marginTop: '80px'
          }}>
            <h3 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px' }}>
              Ready to Transform Your Brand?
            </h3>
            <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              Get instant consultation with our AI brand strategist or book a strategy call with our team.
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
        </main>
      </div>
    </>
  )
}