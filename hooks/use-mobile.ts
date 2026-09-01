"use client"

import { useEffect, useState } from "react"

export const MOBILE_BREAKPOINT = 768

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mediaQuery.addEventListener("change", onChange)
    onChange()

    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
