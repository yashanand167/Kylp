"use client"

import { useEffect, useRef } from "react"
import { sileo } from "sileo"
import { useMobile } from "@/hooks/use-mobile"

export function useMobileWarning(enabled = true) {
  const isMobile = useMobile()
  const warningId = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      if (warningId.current) {
        sileo.dismiss(warningId.current)
        warningId.current = null
      }
      return
    }

    if (isMobile) {
      if (warningId.current) return

      warningId.current = sileo.warning({
        title: "Better on desktop",
        description:
          "The keyboard UI doesn't fit well on mobile. Open this on a larger screen for the best experience.",
        position: "top-center",
        duration: null,
      })

      return
    }

    if (warningId.current) {
      sileo.dismiss(warningId.current)
      warningId.current = null
    }
  }, [enabled, isMobile])
}
