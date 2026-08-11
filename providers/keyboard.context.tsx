"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react"
import { metalClickSound } from "@/lib/metal-click"
import { playSound, type SoundPlayback } from "@/lib/sound-engine"

export type KeyConfig = {
  code: string
  label: string
  sound: string
  volume?: number
  pitch?: number
  modifier?: boolean
}

type KeyboardContextValue = {
  press: (key: string) => void
  release: (key: string) => void
  onClick: (key: string) => void
  getKeyConfig: (key: string) => KeyConfig | undefined
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

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const activeKeys = useRef(new Map<string, SoundPlayback>())

  const play = useCallback(
    async (
      key: string,
      overrides?: { volume?: number; playbackRate?: number }
    ) => {
      const config = KEY_CONFIGS[key]
      if (!config) return null

      return playSound(metalClickSound.dataUri, {
        volume: overrides?.volume ?? config.volume ?? 1,
        playbackRate: overrides?.playbackRate ?? config.pitch ?? 1,
      })
    },
    []
  )

  const release = useCallback((key: string) => {
    const playback = activeKeys.current.get(key)
    if (!playback) return

    playback.stop()
    activeKeys.current.delete(key)
  }, [])

  const press = useCallback(
    (key: string) => {
      release(key)

      void play(key).then((playback) => {
        if (playback) {
          activeKeys.current.set(key, playback)
        }
      })
    },
    [play, release]
  )

  const onClick = useCallback(
    (key: string) => {
      void play(key)
    },
    [play]
  )

  const getKeyConfig = useCallback((key: string) => KEY_CONFIGS[key], [])

  return (
    <KeyboardContext.Provider
      value={{ press, release, onClick, getKeyConfig }}
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
