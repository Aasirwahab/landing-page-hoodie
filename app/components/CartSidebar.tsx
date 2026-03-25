'use client'

import { useCart, useCartActions } from '../context/CartContext'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CartSidebar() {
  const { state } = useCart()
  const { removeItem, updateQuantity, setCartOpen, clearCart } = useCartActions()
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (state.isOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-toggle')) {
        setCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [state.isOpen, setCartOpen])

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [state.isOpen])

  const handleCheckout = () => {
    if (state.items.length === 0) return
    setCartOpen(false)
    router.push('/checkout')
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  if (!state.isOpen || !isSignedIn) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
        style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
      />

      <div
        className="cart-sidebar fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
        style={{
          transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)',
          zIndex: 9999,
          backgroundColor: 'white',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {paymentSuccess && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <i className="ri-check-line text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-600">Redirecting to checkout...</p>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {state.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: item.thumbBackground }}
                    >
                      <Image
                        src={item.imageUrl || '/images/1.png'}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.color}</p>
                      <p className="text-lg font-bold text-gray-900">{item.priceFormatted}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={isProcessingPayment}
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={isProcessingPayment}
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                      disabled={isProcessingPayment}
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(state.total)}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessingPayment}
                >
                  Clear Cart
                </button>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <i className="ri-secure-payment-line mr-2"></i>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
