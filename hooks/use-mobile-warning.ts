"use client"

import { useEffect, useRef } from "react"
import { sileo } from "sileo"
import { useMobile } from "@/hooks/use-mobile"

const MOBILE_WARNING_ID = "mobile-view-warning"

export function useMobileWarning() {
  const isMobile = useMobile()
  const warningId = useRef<string | null>(null)

  useEffect(() => {
    if (isMobile) {
      if (warningId.current) return

      warningId.current = sileo.warning({
        id: MOBILE_WARNING_ID,
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
  }, [isMobile])
}
