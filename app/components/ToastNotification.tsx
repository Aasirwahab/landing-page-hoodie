'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  productColor?: string
  customStyle?: React.CSSProperties
}

export default function ToastNotification({ message, type, isVisible, onClose, productColor, customStyle }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const icon = type === 'success' ? 'ri-check-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'

  // Get dynamic background based on product color
  const getProductBackground = () => {
    if (customStyle) return customStyle
    
    if (productColor) {
      switch (productColor) {
        case 'Blood Orange':
          return {
            background: 'linear-gradient(135deg, #FE783D, #FF6B35)',
            border: '1px solid rgba(254, 120, 61, 0.3)',
          }
        case 'Ocean Blue':
          return {
            background: 'linear-gradient(135deg, #00499D, #0066CC)',
            border: '1px solid rgba(0, 73, 157, 0.3)',
          }
        case 'Royal Purple':
          return {
            background: 'linear-gradient(135deg, #511990, #DAB1C8)',
            border: '1px solid rgba(81, 25, 144, 0.3)',
          }
        default:
          return {
            background: 'linear-gradient(135deg, #FE783D, #FF6B35)',
            border: '1px solid rgba(254, 120, 61, 0.3)',
          }
      }
    }
    
    // Default fallback
    return {
      background: type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : 
                  type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 
                  'linear-gradient(135deg, #3B82F6, #2563EB)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }
  }

  const dynamicStyle = getProductBackground()

  return (
    <div 
      className={`fixed top-6 right-6 z-50 text-white px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        ...dynamicStyle,
        backdropFilter: 'blur(15px)',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center space-x-3">
        <i className={`${icon} text-xl`}></i>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200 transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>
    </div>
  )
}

// Hook to manage toast notifications
export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
    productColor?: string
    customStyle?: React.CSSProperties
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'info',
    productColor?: string,
    customStyle?: React.CSSProperties
  ) => {
    setToast({ message, type, isVisible: true, productColor, customStyle })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return { toast, showToast, hideToast }
} 