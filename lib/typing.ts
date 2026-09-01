import { codeToKeyId } from "@/lib/keyboard-keys"

export type TypingInput =
  | { type: "char"; value: string }
  | { type: "backspace" }

const KEY_ID_INPUT_MAP: Record<string, string> = {
  space: " ",
  comma: ",",
  period: ".",
  slash: "/",
  semicolon: ";",
  quote: "'",
  minus: "-",
  equal: "=",
  backquote: "`",
  bracketleft: "[",
  bracketright: "]",
  backslash: "\\",
}

export function keyIdToInput(keyId: string): TypingInput | null {
  if (keyId === "backspace") {
    return { type: "backspace" }
  }

  if (keyId.length === 1 && keyId >= "a" && keyId <= "z") {
    return { type: "char", value: keyId }
  }

  const mapped = KEY_ID_INPUT_MAP[keyId]
  if (mapped) {
    return { type: "char", value: mapped }
  }

  return null
}

export function keyboardEventToInput(event: KeyboardEvent): TypingInput | null {
  if (event.key === "Backspace") {
    return { type: "backspace" }
  }

  if (event.key.length === 1) {
    return { type: "char", value: event.key }
  }

  return null
}

export function isTypingKeyboardEvent(event: KeyboardEvent): boolean {
  if (event.metaKey || event.ctrlKey || event.altKey) return false
  if (event.repeat) return false

  const keyId = codeToKeyId(event.code)
  if (!keyId) return false

  return keyboardEventToInput(event) !== null
}

export function countCorrectCharacters(target: string, typed: string): number {
  let correct = 0

  for (let index = 0; index < typed.length; index++) {
    if (typed[index] === target[index]) {
      correct++
    }
  }

  return correct
}

export function calculateWpm(correctCharacters: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  return Math.round(correctCharacters / 5 / (durationSeconds / 60))
}
