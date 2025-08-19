import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const authToken = localStorage.getItem('bttr_admin_auth')
    if (authToken === 'authenticated') {
      router.push('/admin/conversations')
    }
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple password check (in production, use proper authentication)
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'bttr2024'
    
    if (password === adminPassword) {
      localStorage.setItem('bttr_admin_auth', 'authenticated')
      router.push('/admin/conversations')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - Bttr AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Bttr AI Admin
          </h1>
          
          <p style={{ 
            fontSize: '14px', 
            color: '#888',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Enter password to access conversation analytics
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#007AFF',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Access Dashboard
            </button>
          </form>

          <div style={{
            marginTop: '30px',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#93c5fd'
          }}>
            <strong>Note:</strong> This dashboard shows all visitor conversations with the AI to help improve the user experience. All data is stored locally and used solely for optimization purposes.
          </div>
        </div>
      </div>
    </>
  )
}