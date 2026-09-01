"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  calculateWpm,
  countCorrectCharacters,
  getCurrentWordIndex,
  getNextWordStart,
  getWordSegments,
  getWordStatus,
  type TypingInput,
} from "@/lib/typing"
import {
  generatePracticePhrase,
  PRACTICE_APPEND_WORD_COUNT,
  PRACTICE_INITIAL_WORD_COUNT,
  PRACTICE_TEST_DURATION_SECONDS,
  PRACTICE_WORDS_BATCH_INTERVAL_MS,
} from "@/lib/words"
import { useKeyboard } from "@/providers/keyboard.context"

type TestPhase = "idle" | "running" | "finished"

export function WritingPractice() {
  const { subscribeToInput } = useKeyboard()
  const [includePunctuation, setIncludePunctuation] = useState(false)
  const [phase, setPhase] = useState<TestPhase>("idle")
  const [targetText, setTargetText] = useState("")
  const [typedByIndex, setTypedByIndex] = useState<Map<number, string>>(
    () => new Map()
  )
  const [cursor, setCursor] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PRACTICE_TEST_DURATION_SECONDS)
  const [wpm, setWpm] = useState(0)
  const typedByIndexRef = useRef<Map<number, string>>(new Map())
  const cursorRef = useRef(0)
  const targetRef = useRef("")

  const wordSegments = useMemo(
    () => getWordSegments(targetText),
    [targetText]
  )
  const currentWordIndex = useMemo(
    () => getCurrentWordIndex(wordSegments, cursor),
    [wordSegments, cursor]
  )

  const generateOptions = useCallback(
    (wordCount: number) => ({
      wordCount,
      includePunctuation,
    }),
    [includePunctuation]
  )

  const resetTypingState = useCallback(() => {
    typedByIndexRef.current = new Map()
    cursorRef.current = 0
    setTypedByIndex(new Map())
    setCursor(0)
  }, [])

  const resetTest = useCallback(() => {
    const initialText = generatePracticePhrase(
      generateOptions(PRACTICE_INITIAL_WORD_COUNT)
    )
    targetRef.current = initialText
    resetTypingState()
    setTargetText(initialText)
    setSecondsLeft(PRACTICE_TEST_DURATION_SECONDS)
    setWpm(0)
    setPhase("idle")
  }, [generateOptions, resetTypingState])

  const finishTest = useCallback(() => {
    const correctCharacters = countCorrectCharacters(
      targetRef.current,
      typedByIndexRef.current,
      cursorRef.current
    )
    setWpm(calculateWpm(correctCharacters, PRACTICE_TEST_DURATION_SECONDS))
    setPhase("finished")
  }, [])

  const startTest = useCallback(() => {
    const initialText = generatePracticePhrase(
      generateOptions(PRACTICE_INITIAL_WORD_COUNT)
    )
    targetRef.current = initialText
    resetTypingState()
    setTargetText(initialText)
    setSecondsLeft(PRACTICE_TEST_DURATION_SECONDS)
    setWpm(0)
    setPhase("running")
  }, [generateOptions, resetTypingState])

  const applyInput = useCallback((input: TypingInput) => {
    const target = targetRef.current

    if (input.type === "backspace") {
      if (cursorRef.current === 0) return

      cursorRef.current -= 1
      typedByIndexRef.current.delete(cursorRef.current)
      setCursor(cursorRef.current)
      setTypedByIndex(new Map(typedByIndexRef.current))
      return
    }

    if (input.value === " ") {
      const nextWordStart = getNextWordStart(target, cursorRef.current)
      if (nextWordStart === cursorRef.current) return

      cursorRef.current = nextWordStart
      setCursor(nextWordStart)
      return
    }

    if (cursorRef.current >= target.length) return

    typedByIndexRef.current.set(cursorRef.current, input.value)
    cursorRef.current += 1
    setCursor(cursorRef.current)
    setTypedByIndex(new Map(typedByIndexRef.current))
  }, [])

  useEffect(() => {
    resetTest()
  }, [resetTest])

  useEffect(() => {
    if (phase !== "running") return

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          finishTest()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finishTest, phase])

  useEffect(() => {
    if (phase !== "running") return

    const appendWords = window.setInterval(() => {
      const addition = generatePracticePhrase(
        generateOptions(PRACTICE_APPEND_WORD_COUNT)
      )
      setTargetText((current) => {
        const next = `${current} ${addition}`
        targetRef.current = next
        return next
      })
    }, PRACTICE_WORDS_BATCH_INTERVAL_MS)

    return () => window.clearInterval(appendWords)
  }, [generateOptions, phase])

  useEffect(() => {
    if (phase !== "running") return

    return subscribeToInput(applyInput)
  }, [applyInput, phase, subscribeToInput])

  function togglePunctuation() {
    if (phase === "running") return
    setIncludePunctuation((current) => !current)
  }

  return (
    <section className="flex w-full max-w-4xl flex-col items-center gap-4 px-2 pt-32 font-sans sm:gap-5 sm:px-4 sm:pt-0">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant={includePunctuation ? "default" : "outline"}
          size="sm"
          disabled={phase === "running"}
          onClick={togglePunctuation}
        >
          Punctuation {includePunctuation ? "on" : "off"}
        </Button>
        {phase === "running" ? (
          <Button type="button" variant="outline" size="sm" disabled>
            {secondsLeft}s left
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={startTest}>
            {phase === "finished" ? "Try again" : "Start"}
          </Button>
        )}
      </div>

      {phase === "running" && wordSegments[currentWordIndex] && (
        <p className="text-sm text-muted-foreground">
          Word {currentWordIndex + 1} of {wordSegments.length}
        </p>
      )}

      <p className="min-h-24 w-full text-center text-lg leading-8 tracking-tight sm:min-h-32 sm:text-left sm:text-xl sm:leading-10 md:text-2xl md:leading-11">
        {wordSegments.map((segment, wordIndex) => {
          const status = getWordStatus(
            segment,
            wordIndex,
            currentWordIndex,
            targetText,
            typedByIndex
          )

          return (
            <span key={`${segment.start}-${segment.text}`} className="inline">
              {wordIndex > 0 && (
                <span
                  className={cn(
                    "text-muted-foreground/40",
                    wordIndex <= currentWordIndex && "text-muted-foreground/60"
                  )}
                >
                  {" "}
                </span>
              )}
              <span
                className={cn(
                  "inline-block rounded-md px-1 transition-colors",
                  status === "current" &&
                    "bg-neutral-900/8 ring-1 ring-neutral-900/10",
                  status === "correct" && "text-emerald-700",
                  status === "incorrect" && "text-destructive",
                  status === "upcoming" && "text-muted-foreground/45"
                )}
              >
                {segment.text.split("").map((character, offset) => {
                  const index = segment.start + offset
                  const typedCharacter = typedByIndex.get(index)
                  const isTyped = typedCharacter !== undefined
                  const isSkipped = !isTyped && index < cursor
                  const isCurrent = index === cursor

                  return (
                    <span
                      key={`${index}-${character}`}
                      className={cn(
                        status === "current" &&
                          isTyped &&
                          typedCharacter === character &&
                          "text-foreground",
                        status === "current" &&
                          isTyped &&
                          typedCharacter !== character &&
                          "text-destructive",
                        status === "current" &&
                          isSkipped &&
                          "text-destructive",
                        status === "current" &&
                          !isTyped &&
                          !isSkipped &&
                          "text-muted-foreground/70",
                        isCurrent &&
                          phase === "running" &&
                          "underline decoration-2 underline-offset-4"
                      )}
                    >
                      {character}
                    </span>
                  )
                })}
              </span>
            </span>
          )
        })}
      </p>

      {phase === "finished" && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Result</p>
          <p className="text-4xl font-medium tracking-tight text-foreground">
            {wpm} WPM
          </p>
        </div>
      )}

      {phase === "idle" && (
        <p className="text-sm text-muted-foreground">
          Press Start for a 1-minute typing test. New words will keep appearing
          as you practice.
        </p>
      )}
    </section>
  )
}
