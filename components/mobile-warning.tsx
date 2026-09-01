"use client"

import { usePathname } from "next/navigation"
import { useMobileWarning } from "@/hooks/use-mobile-warning"

const ROUTES_WITHOUT_TOAST = ["/typing-techniques"]

export function MobileWarning() {
  const pathname = usePathname()
  const enabled = !ROUTES_WITHOUT_TOAST.includes(pathname)

  useMobileWarning(enabled)

  return null
}
