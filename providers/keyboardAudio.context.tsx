"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react"

type KeyboardAudioContext = {
  press: (key: string) => void
  release: (key: string) => void
  onClick: (key: string) => void
}

const mainKeys = {
  a: {
    sound: "a",
    volume: 1,
    pitch: 1,
  },
  b: {
    sound: "b",
    volume: 1,
    pitch: 1,
  },
  c: {
    sound: "c",
    volume: 1,
    pitch: 1,
  },
  d: {
    sound: "d",
    volume: 1,
    pitch: 1,
  },
  e: {
    sound: "e",
    volume: 1,
    pitch: 1,
  },
  f: {
    sound: "f",
    volume: 1,
    pitch: 1,
  },
  g: {
    sound: "g",
    volume: 1,
    pitch: 1,
  },
  h: {
    sound: "h",
    volume: 1,
    pitch: 1,
  },
  i: {
    sound: "i",
    volume: 1,
    pitch: 1,
  },
  j: {
    sound: "j",
    volume: 1,
    pitch: 1,
  },
  k: {
    sound: "k",
    volume: 1,
    pitch: 1,
  },
  l: {
    sound: "l",
    volume: 1,
    pitch: 1,
  },
  m: {
    sound: "m",
    volume: 1,
    pitch: 1,
  },
  n: {
    sound: "n",
    volume: 1,
    pitch: 1,
  },
  o: {
    sound: "o",
    volume: 1,
    pitch: 1,
  },
  p: {
    sound: "p",
    volume: 1,
    pitch: 1,
  },
  q: {
    sound: "q",
    volume: 1,
    pitch: 1,
  },
  r: {
    sound: "r",
    volume: 1,
    pitch: 1,
  },
  s: {
    sound: "s",
    volume: 1,
    pitch: 1,
  },
  t: {
    sound: "t",
    volume: 1,
    pitch: 1,
  },  
  u: {
    sound: "u",
    volume: 1,
    pitch: 1,
  },
  v: {
    sound: "v",
    volume: 1,
    pitch: 1,
  },
  w: {
    sound: "w",
    volume: 1,
    pitch: 1,
  },
  x: {
    sound: "x",
    volume: 1,
    pitch: 1,
  },
  y: {
    sound: "y",
    volume: 1,
    pitch: 1,
  },
  z: {
    sound: "z",
    volume: 1,
    pitch: 1,
  },  
  space: {
    sound: "space",
    volume: 1,
    pitch: 1,
  },
  enter: {
    sound: "enter",
    volume: 1,
    pitch: 1,
  },
  backspace: {
    sound: "backspace",
    volume: 1,
    pitch: 1,
  },
  delete: {
    sound: "delete",
    volume: 1,
}}

const AudioContext = createContext<KeyboardAudioContext | null>(null)

export function KeyboardAudioProvider({
  children,
}: {
  children: ReactNode
}) {
  const audioRef = useRef<{
    ctx: globalThis.AudioContext
    master: GainNode
    buffers: AudioBuffer[]
  } | null>(null)

  const activeKeys = useRef(
    new Map<string, AudioBufferSourceNode>()
  )

  function initAudio() {
    if (audioRef.current) return audioRef.current

    const ctx = new window.AudioContext()

    const master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(ctx.destination)

    audioRef.current = {
      ctx,
      master,
      buffers: [],
    }

    return audioRef.current
  }

  function play(
    key: string,
    buffer: AudioBuffer,
    volume = 1,
    playbackRate = 1
  ) {
    const audio = initAudio()

    const source = audio.ctx.createBufferSource()
    const gain = audio.ctx.createGain()

    source.buffer = buffer
    source.playbackRate.value = playbackRate
    gain.gain.value = volume

    source.connect(gain)
    gain.connect(audio.master)

    source.start()

    activeKeys.current.set(key, source)
  }

  function press(key: string) {
    // choose sound + volume + pitch
  }

  function release(key: string) {
    // choose release sound
  }

  function onClick(key: string) {
    // function
  }

  return (
    <AudioContext.Provider value={{ press, release, onClick }}>
      {children}
    </AudioContext.Provider>
  )
}