import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, duration = 1000, decimals = 0) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)
  const start = useRef(null)

  useEffect(() => {
    const from = 0
    const to = Math.abs(target)

    const step = (timestamp) => {
      if (!start.current) start.current = timestamp
      const elapsed = timestamp - start.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(parseFloat((from + (to - from) * eased).toFixed(decimals)))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, decimals])

  return value
}
