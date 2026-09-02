"use client"

import { useSyncExternalStore } from "react"

export const MOBILE_BREAKPOINT = 768

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
  )
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
