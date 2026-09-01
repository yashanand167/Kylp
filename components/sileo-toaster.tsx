"use client"

import { Toaster } from "sileo"

export function SileoToaster() {
  return (
    <Toaster
      position="top-center"
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
