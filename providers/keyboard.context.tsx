"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  codeToKeyId,
  KEY_CONFIGS,
  KEYBOARD_LAYOUT,
  type KeyConfig,
} from "@/lib/keyboard-keys"
import { playMetalClick } from "@/lib/metal-click"

export type { KeyConfig }
export { KEYBOARD_LAYOUT, KEY_CONFIGS }

type KeyboardContextValue = {
  onClick: (key: string) => void
  getKeyConfig: (key: string) => KeyConfig | undefined
  isKeyPressed: (key: string) => boolean
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set())

  const onClick = useCallback((key: string) => {
    const config = KEY_CONFIGS[key]
    if (!config) return

    void playMetalClick({
      playbackRate: config.pitch ?? 1,
    })
  }, [])

  const getKeyConfig = useCallback((key: string) => KEY_CONFIGS[key], [])

  const isKeyPressed = useCallback(
    (key: string) => pressedKeys.has(key),
    [pressedKeys]
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return

      const keyId = codeToKeyId(event.code)
      if (!keyId || !KEY_CONFIGS[keyId]) return

      onClick(keyId)
      setPressedKeys((current) => new Set(current).add(keyId))
    }

    function handleKeyUp(event: KeyboardEvent) {
      const keyId = codeToKeyId(event.code)
      if (!keyId || !KEY_CONFIGS[keyId]) return

      setPressedKeys((current) => {
        if (!current.has(keyId)) return current
        const next = new Set(current)
        next.delete(keyId)
        return next
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [onClick])

  return (
    <KeyboardContext.Provider value={{ onClick, getKeyConfig, isKeyPressed }}>
      {children}
    </KeyboardContext.Provider>
  )
}

export function useKeyboard() {
  const context = useContext(KeyboardContext)
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider")
  }
  return context
}
