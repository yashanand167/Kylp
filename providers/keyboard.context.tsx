"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
import {
  keyIdToInput,
  keyboardEventToInput,
  type TypingInput,
} from "@/lib/typing"

export type { KeyConfig }
export { KEYBOARD_LAYOUT, KEY_CONFIGS }

type KeyboardContextValue = {
  pressKey: (key: string) => void
  getKeyConfig: (key: string) => KeyConfig | undefined
  isKeyPressed: (key: string) => boolean
  setSoundEnabled: (enabled: boolean) => void
  subscribeToInput: (listener: (input: TypingInput) => void) => () => void
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set())
  const inputListeners = useRef(new Set<(input: TypingInput) => void>())
  const soundEnabledRef = useRef(false)

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEnabledRef.current = enabled
  }, [])

  const emitInput = useCallback((input: TypingInput) => {
    inputListeners.current.forEach((listener) => listener(input))
  }, [])

  const playKey = useCallback((key: string) => {
    if (!soundEnabledRef.current) return

    const config = KEY_CONFIGS[key]
    if (!config) return

    void playMetalClick({
      playbackRate: config.pitch ?? 1,
    })
  }, [])

  const pressKey = useCallback(
    (key: string, event?: KeyboardEvent) => {
      if (!KEY_CONFIGS[key]) return

      playKey(key)

      const input = event ? keyboardEventToInput(event) : keyIdToInput(key)
      if (input) {
        emitInput(input)
      }
    },
    [emitInput, playKey]
  )

  const getKeyConfig = useCallback((key: string) => KEY_CONFIGS[key], [])

  const isKeyPressed = useCallback(
    (key: string) => pressedKeys.has(key),
    [pressedKeys]
  )

  const subscribeToInput = useCallback((listener: (input: TypingInput) => void) => {
    inputListeners.current.add(listener)
    return () => {
      inputListeners.current.delete(listener)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return

      const keyId = codeToKeyId(event.code)
      if (!keyId || !KEY_CONFIGS[keyId]) return

      pressKey(keyId, event)
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
  }, [pressKey])

  return (
    <KeyboardContext.Provider
      value={{
        pressKey,
        getKeyConfig,
        isKeyPressed,
        setSoundEnabled,
        subscribeToInput,
      }}
    >
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
