"use client"

import { Toaster } from "sileo"
import { useMobile } from "@/hooks/use-mobile"

export function SileoToaster() {
  const isMobile = useMobile()

  return (
    <Toaster
      position="top-center"
      offset={isMobile ? { top: 12 } : { top: 16 }}
      options={{
        fill: "#000000",
        styles: {
          title: "text-white!",
          description: "text-white/80!",
          badge: "bg-white/10!",
          button: "bg-white/10! hover:bg-white/15!",
        },
      }}
    />
  )
}
