"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { metalClickSound } from "@/lib/metal-click"
import { playSound } from "@/lib/sound-engine"

export type KeyConfig = {
  code: string
  label: string
  sound: string
  volume?: number
  pitch?: number
  modifier?: boolean
}

type KeyboardContextValue = {
  onClick: (key: string) => void
  getKeyConfig: (key: string) => KeyConfig | undefined
  isKeyPressed: (key: string) => boolean
}

const SPECIAL_KEYS: Record<string, KeyConfig> = {
  space: {
    code: "space",
    label: "Space",
    sound: metalClickSound.name,
    volume: 1,
    pitch: 1,
    modifier: true,
  },
  enter: {
    code: "enter",
    label: "Enter",
    sound: metalClickSound.name,
    volume: 1,
    pitch: 1,
    modifier: true,
  },
  backspace: {
    code: "backspace",
    label: "Backspace",
    sound: metalClickSound.name,
    volume: 1,
    pitch: 1,
    modifier: true,
  },
  delete: {
    code: "delete",
    label: "Delete",
    sound: metalClickSound.name,
    volume: 1,
    pitch: 1,
    modifier: true,
  },
}

const LETTER_KEYS = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").map((letter) => [
    letter,
    {
      code: letter,
      label: letter.toUpperCase(),
      sound: metalClickSound.name,
      volume: 1,
      pitch: 1,
    } satisfies KeyConfig,
  ])
) as Record<string, KeyConfig>

const KEY_CONFIGS: Record<string, KeyConfig> = {
  ...LETTER_KEYS,
  ...SPECIAL_KEYS,
}

function codeToKeyId(code: string): string | null {
  if (code.startsWith("Key")) {
    return code.slice(3).toLowerCase()
  }

  switch (code) {
    case "Space":
      return "space"
    case "Enter":
      return "enter"
    case "Backspace":
      return "backspace"
    case "Delete":
      return "delete"
    default:
      return null
  }
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set())

  const onClick = useCallback((key: string) => {
    const config = KEY_CONFIGS[key]
    if (!config) return

    void playSound(metalClickSound.dataUri, {
      volume: config.volume ?? 1,
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
