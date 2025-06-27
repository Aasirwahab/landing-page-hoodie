'use client'

export default function SimplePage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom, #FE783D, #121826)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ Next.js Working!</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Basic setup is functional. Let's debug the main page.
      </p>
      
      {/* Simple test of image loading */}
      <div style={{ 
        width: '200px', 
        height: '100px', 
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <span>Image Test Area</span>
      </div>
      
      <button 
        style={{
          padding: '15px 30px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onClick={() => {
          alert('JavaScript is working!')
          console.log('✅ All systems go!')
        }}
      >
        Test Interaction
      </button>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>
          ← Back to Main Moncler Page
        </a>
      </div>
    </div>
  )
} 