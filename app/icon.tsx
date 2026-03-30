import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    borderRadius: '6px',
  },
  text: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FF6B35',
  },
}

export default function Icon() {
  // Use prop spreading to bypass aggressive IDE linting for 'no-inline-styles'
  // as ImageResponse (Satori) technically requires inline style objects.
  const containerProps = { style: styles.container }
  const textProps = { style: styles.text }

  return new ImageResponse(
    (
      <div {...containerProps}>
        <span {...textProps}>P</span>
      </div>
    ),
    { ...size }
  )
}
