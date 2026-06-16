import { useEffect, useRef } from 'react'

function hueForPercent(p) {
  if (p < 20) return 0
  if (p < 30) return ((p - 20) / 10) * 30
  if (p < 50) return 30 + ((p - 30) / 20) * 20
  if (p < 70) return 50 + ((p - 50) / 20) * 70
  return 120
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function RatingMeter({ rating, size = 44 }) {
  const targetPercent = Math.round((rating / 10) * 100)
  const center = size / 2
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius

  const circleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const duration = 1200
    let start = null
    let raf

    function step(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const current = eased * targetPercent
      const offset = circumference - (current / 100) * circumference
      const hue = hueForPercent(current)

      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = offset
        circleRef.current.style.stroke = `hsl(${hue}, 85%, 50%)`
      }

      if (textRef.current) {
        textRef.current.textContent = Math.round(current)
      }

      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [targetPercent, circumference])

  return (
    <div
      className="flex items-center justify-center rounded-full bg-black/80"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={3}
        />
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#FF6347"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          ref={textRef}
          x={center}
          y={center + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.3}
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
        >
          0
        </text>
      </svg>
    </div>
  )
}
