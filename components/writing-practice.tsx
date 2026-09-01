"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  calculateWpm,
  countCorrectCharacters,
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

function applyTypingInput(current: string, input: TypingInput): string {
  if (input.type === "backspace") {
    return current.slice(0, -1)
  }

  return current + input.value
}

export function WritingPractice() {
  const { subscribeToInput } = useKeyboard()
  const [includePunctuation, setIncludePunctuation] = useState(false)
  const [phase, setPhase] = useState<TestPhase>("idle")
  const [targetText, setTargetText] = useState("")
  const [typedText, setTypedText] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(PRACTICE_TEST_DURATION_SECONDS)
  const [wpm, setWpm] = useState(0)
  const typedRef = useRef("")
  const targetRef = useRef("")

  const generateOptions = useCallback(
    (wordCount: number) => ({
      wordCount,
      includePunctuation,
    }),
    [includePunctuation]
  )

  const resetTest = useCallback(() => {
    const initialText = generatePracticePhrase(
      generateOptions(PRACTICE_INITIAL_WORD_COUNT)
    )
    targetRef.current = initialText
    typedRef.current = ""
    setTargetText(initialText)
    setTypedText("")
    setSecondsLeft(PRACTICE_TEST_DURATION_SECONDS)
    setWpm(0)
    setPhase("idle")
  }, [generateOptions])

  const finishTest = useCallback(() => {
    const correctCharacters = countCorrectCharacters(
      targetRef.current,
      typedRef.current
    )
    setWpm(calculateWpm(correctCharacters, PRACTICE_TEST_DURATION_SECONDS))
    setPhase("finished")
  }, [])

  const startTest = useCallback(() => {
    const initialText = generatePracticePhrase(
      generateOptions(PRACTICE_INITIAL_WORD_COUNT)
    )
    targetRef.current = initialText
    typedRef.current = ""
    setTargetText(initialText)
    setTypedText("")
    setSecondsLeft(PRACTICE_TEST_DURATION_SECONDS)
    setWpm(0)
    setPhase("running")
  }, [generateOptions])

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

    return subscribeToInput((input) => {
      setTypedText((current) => {
        const next = applyTypingInput(current, input)
        typedRef.current = next
        return next
      })
    })
  }, [phase, subscribeToInput])

  function togglePunctuation() {
    if (phase === "running") return
    setIncludePunctuation((current) => !current)
  }

  return (
    <section className="flex w-full max-w-4xl flex-col items-center gap-5 px-4 font-sans">
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

      <p className="min-h-32 w-full text-left text-xl leading-8 tracking-tight sm:text-2xl sm:leading-9">
        {targetText.split("").map((character, index) => {
          const typedCharacter = typedText[index]
          const isTyped = index < typedText.length
          const isCurrent = index === typedText.length

          return (
            <span
              key={`${index}-${character}`}
              className={cn(
                isTyped &&
                  typedCharacter === character &&
                  "text-foreground",
                isTyped &&
                  typedCharacter !== character &&
                  "bg-destructive/15 text-destructive",
                !isTyped && "text-muted-foreground/70",
                isCurrent && phase === "running" && "border-b-2 border-foreground text-foreground"
              )}
            >
              {character}
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
