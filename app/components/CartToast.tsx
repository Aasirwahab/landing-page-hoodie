'use client'

import { useEffect, useState } from 'react'

interface CartToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export default function CartToast({ message, type, isVisible, onClose }: CartToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          borderColor: '#059669',
          icon: 'ri-check-circle-fill'
        }
      case 'error':
        return {
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          icon: 'ri-error-warning-fill'
        }
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          icon: 'ri-information-fill'
        }
      default:
        return {
          backgroundColor: '#6B7280',
          borderColor: '#4B5563',
          icon: 'ri-information-line'
        }
    }
  }

  const toastStyle = getToastColor()

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        backgroundColor: toastStyle.backgroundColor,
        borderLeft: `4px solid ${toastStyle.borderColor}`,
        color: 'white',
        minWidth: '300px',
        maxWidth: '500px'
      }}
    >
      <i className={`${toastStyle.icon} text-xl`}></i>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-white hover:text-gray-200 transition-colors"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  )
}

// Hook to manage cart toast notifications
export function useCartToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return { toast, showToast, hideToast }
} 