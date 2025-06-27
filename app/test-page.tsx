'use client'

export default function TestPage() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #FE783D, #121826)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>✅ Next.js is Working!</h1>
        <p style={{ marginTop: '20px', fontSize: '16px' }}>
          This confirms the basic setup is functional.
        </p>
        <button 
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
          onClick={() => {
            console.log('Button clicked!')
            alert('JavaScript is working!')
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  )
} 