'use client'

import { useState } from 'react'
import PageLayout from '../components/PageLayout'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard domestic shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee. International orders typically arrive within 10-21 business days depending on the destination and customs processing.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a confirmation email with a tracking number and a link to track your package in real time. You can also view your order status by logging into your POSSESSD account and navigating to Order History.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping rates and estimated delivery times are calculated at checkout based on your location. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient.',
      },
      {
        question: 'Can I modify or cancel my order after placing it?',
        answer: 'We process orders quickly to ensure fast delivery. If you need to modify or cancel your order, please contact us at support@possessd.com within 1 hour of placing it. Once an order has entered the fulfillment process, we are unable to make changes.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return window from the date of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Visit our Returns & Exchanges page for full details and to initiate a return.',
      },
      {
        question: 'How do I exchange an item for a different size?',
        answer: 'To exchange an item, initiate a return through your account or by emailing returns@possessd.com. Indicate the size you need, and once we receive and inspect the original item, we will ship your replacement free of charge. If the desired size is unavailable, we will issue a full refund.',
      },
      {
        question: 'How long does it take to receive my refund?',
        answer: 'Once we receive your return, inspection takes 1-2 business days. Refunds are then processed within 3-5 business days to your original payment method. Depending on your bank, it may take an additional 5-10 business days for the funds to appear in your account.',
      },
    ],
  },
  {
    title: 'Products & Care',
    items: [
      {
        question: 'What materials are used in POSSESSD outerwear?',
        answer: 'Our outerwear is crafted from premium technical fabrics including Japanese Toray nylon, Gore-Tex membranes, YKK Aquaguard zippers, and responsibly sourced down insulation. Each product page details the specific materials and technical specifications.',
      },
      {
        question: 'How should I care for my POSSESSD jacket?',
        answer: 'We recommend spot cleaning with a damp cloth for minor stains. For a full wash, use a gentle cycle with cold water and a technical fabric detergent. Do not bleach or dry clean. Tumble dry on low heat to restore loft to down-filled pieces. Detailed care instructions are included on each garment\'s interior label.',
      },
      {
        question: 'Are your products waterproof?',
        answer: 'Many of our outerwear pieces feature water-resistant or waterproof construction. Products with Gore-Tex or sealed seam technology offer full waterproof protection. Water resistance ratings are clearly listed on each product page. We recommend reapplying DWR (Durable Water Repellent) treatment periodically for optimal performance.',
      },
      {
        question: 'Do you offer a warranty on your products?',
        answer: 'Every POSSESSD piece comes with a 2-year warranty covering manufacturing defects in materials and workmanship under normal use. This warranty does not cover damage from misuse, alterations, or normal wear and tear. Contact support@possessd.com with photos and your order number to file a warranty claim.',
      },
    ],
  },
  {
    title: 'Account & Payment',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely through Stripe with full PCI-DSS compliance.',
      },
      {
        question: 'Do I need an account to place an order?',
        answer: 'No, you can checkout as a guest. However, creating a POSSESSD account allows you to track orders, save your shipping information, manage returns, build a wishlist, and receive exclusive early access to new collections and promotions.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use Stripe for payment processing, which employs bank-level encryption and is PCI-DSS Level 1 certified — the highest level of security in the payments industry. We never store your full card details on our servers.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sectionHeading: React.CSSProperties = {
    fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
    color: '#FF6B35', marginTop: '48px', marginBottom: '20px',
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Support
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          FAQ
        </h1>
        <p style={{ opacity: 0.5, fontSize: '15px', marginBottom: '24px', lineHeight: 1.7 }}>
          Everything you need to know about POSSESSD. Can&apos;t find what you&apos;re looking for?{' '}
          <a href="/contact" style={{ color: '#FF6B35', textDecoration: 'none' }}>Reach out to our team</a>.
        </p>

        {faqData.map((category) => (
          <div key={category.title}>
            <p style={sectionHeading}>{category.title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {category.items.map((item, i) => {
                const key = `${category.title}-${i}`
                const isOpen = openItems[key] || false

                return (
                  <div key={key} style={{
                    background: isOpen ? 'rgba(255,107,53,0.04)' : 'rgba(255,255,255,0.04)',
                    border: isOpen ? '1px solid rgba(255,107,53,0.15)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}>
                    <button
                      onClick={() => toggleItem(key)}
                      style={{
                        width: '100%', padding: '20px 24px',
                        background: 'transparent', border: 'none', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', textAlign: 'left' as const, gap: '16px',
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: '500', lineHeight: 1.5 }}>
                        {item.question}
                      </span>
                      <span style={{
                        fontSize: '20px', flexShrink: 0, color: '#FF6B35',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        fontWeight: '300',
                      }}>
                        +
                      </span>
                    </button>
                    <div style={{
                      maxHeight: isOpen ? '400px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease, opacity 0.3s ease',
                      opacity: isOpen ? 1 : 0,
                    }}>
                      <div style={{
                        padding: '0 24px 20px 24px',
                        fontSize: '14px', lineHeight: 1.8, opacity: 0.55,
                      }}>
                        {item.answer}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div style={{
          marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center' as const,
        }}>
          <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Still Have Questions?</p>
          <p style={{ fontSize: '14px', opacity: 0.45, marginBottom: '24px', lineHeight: 1.7 }}>
            Our customer care team is available Monday through Friday, 9:00 AM - 6:00 PM EST.
          </p>
          <a href="/contact" style={{
            display: 'inline-block', padding: '16px 40px', background: '#FF6B35',
            borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '700',
            textDecoration: 'none', letterSpacing: '1px',
          }}>
            CONTACT US
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
