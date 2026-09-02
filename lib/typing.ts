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

export function getWordSegmentAtCursor(
  segments: WordSegment[],
  cursor: number
): WordSegment | undefined {
  return segments[getCurrentWordIndex(segments, cursor)]
}

export function getNextWordStart(target: string, currentIndex: number): number {
  if (currentIndex >= target.length) {
    return target.length
  }

  let index = currentIndex

  while (index < target.length && target[index] !== " ") {
    index++
  }

  while (index < target.length && target[index] === " ") {
    index++
  }

  return index
}

export type WordSegment = {
  text: string
  start: number
  end: number
}

export type WordStatus = "upcoming" | "current" | "correct" | "incorrect"

export function getWordSegments(target: string): WordSegment[] {
  const segments: WordSegment[] = []
  let index = 0

  while (index < target.length) {
    if (target[index] === " ") {
      index++
      continue
    }

    const start = index

    while (index < target.length && target[index] !== " ") {
      index++
    }

    segments.push({
      text: target.slice(start, index),
      start,
      end: index,
    })
  }

  return segments
}

export function getCurrentWordIndex(
  segments: WordSegment[],
  cursor: number
): number {
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index]

    if (cursor <= segment.end) {
      return index
    }
  }

  return Math.max(segments.length - 1, 0)
}

export function getWordStatus(
  segment: WordSegment,
  wordIndex: number,
  currentWordIndex: number,
  target: string,
  typedByIndex: Map<number, string>
): WordStatus {
  if (wordIndex > currentWordIndex) {
    return "upcoming"
  }

  if (wordIndex === currentWordIndex) {
    return "current"
  }

  for (let index = segment.start; index < segment.end; index++) {
    if (!typedByIndex.has(index) || typedByIndex.get(index) !== target[index]) {
      return "incorrect"
    }
  }

  return "correct"
}

export function countCorrectCharacters(
  target: string,
  typedByIndex: Map<number, string>,
  cursor: number
): number {
  let correct = 0

  for (let index = 0; index < cursor; index++) {
    if (typedByIndex.get(index) === target[index]) {
      correct++
    }
  }

  return correct
}

export function calculateWpm(correctCharacters: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  return Math.round(correctCharacters / 5 / (durationSeconds / 60))
}
