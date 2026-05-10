"use client"

import { useState, useEffect, useRef } from "react"
import { animate }                      from "framer-motion"

/**
 * Smoothly transitions a numeric display value whenever `target` changes.
 * Returns a raw number — format it yourself in the component.
 */
export function useAnimatedNumber(target: number, duration = 0.45): number {
  const [current, setCurrent] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return

    const controls = animate(from, target, {
      duration,
      ease: "easeOut",
      onUpdate(v) { setCurrent(v) },
      onComplete() { fromRef.current = target },
    })

    return () => controls.stop()
  }, [target, duration])

  return current
}
