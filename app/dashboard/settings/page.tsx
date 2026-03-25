'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const { user: clerkUser } = useUser()
  const dbUser = useQuery(api.users.getUser)
  const updateProfile = useMutation(api.users.updateProfile)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (dbUser?.name) setName(dbUser.name)
  }, [dbUser])

  const handleSave = async () => {
    await updateProfile({ name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Settings</h1>

      <div style={{
        padding: '24px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', opacity: 0.5, display: 'block', marginBottom: '6px' }}>Email</label>
          <p style={{ fontSize: '15px', opacity: 0.8 }}>{clerkUser?.primaryEmailAddress?.emailAddress || dbUser?.email}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', opacity: 0.5, display: 'block', marginBottom: '6px' }}>Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', opacity: 0.5, display: 'block', marginBottom: '6px' }}>Role</label>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
            background: dbUser?.role === 'admin' ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.08)',
            color: dbUser?.role === 'admin' ? '#FF6B35' : 'rgba(255,255,255,0.6)',
            textTransform: 'capitalize',
          }}>
            {dbUser?.role || 'customer'}
          </span>
        </div>

        <button onClick={handleSave} style={{
          padding: '12px 24px',
          background: saved ? '#4ade80' : '#FF6B35',
          border: 'none', borderRadius: '8px', color: 'white',
          fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
