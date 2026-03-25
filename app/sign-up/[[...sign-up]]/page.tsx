import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #FE783D, #121826)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#121826',
            marginBottom: '10px'
          }}>
            Join Moncler
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px'
          }}>
            Create your account to access exclusive collections and personalized shopping
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
} 