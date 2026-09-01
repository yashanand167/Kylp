"use client"

import { useRef, useState, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import type { KeyConfig } from "@/lib/keyboard-keys"
import { useKeyboard } from "@/providers/keyboard.context"

const sizeClasses: Record<NonNullable<KeyConfig["size"]>, string> = {
  normal: "aspect-square size-8 sm:size-10 md:size-12 lg:size-15",
  wide: "h-8 min-w-12 px-1.5 sm:h-10 sm:min-w-14 sm:px-2 md:h-12 md:min-w-16 lg:h-15 lg:min-w-20",
  "extra-wide":
    "h-8 min-w-14 px-1.5 sm:h-10 sm:min-w-16 md:h-12 md:min-w-20 lg:h-15 lg:min-w-24",
  space:
    "h-8 min-w-28 px-1.5 sm:h-10 sm:min-w-36 md:h-12 md:min-w-48 lg:h-15 lg:min-w-64",
}

type KeyProps = {
  keyId: string
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

export function Key({ keyId, className, ...props }: KeyProps) {
  const { pressKey, getKeyConfig, isKeyPressed } = useKeyboard()
  const [pointerPressed, setPointerPressed] = useState(false)
  const interactedViaPointer = useRef(false)
  const config = getKeyConfig(keyId)
  const pressed = pointerPressed || isKeyPressed(keyId)

  if (!config) return null

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    event.currentTarget.setPointerCapture(event.pointerId)
    interactedViaPointer.current = true
    setPointerPressed(true)
    pressKey(keyId)
    props.onPointerDown?.(event)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    setPointerPressed(false)
    props.onPointerUp?.(event)
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLButtonElement>) {
    setPointerPressed(false)
    props.onPointerLeave?.(event)
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!interactedViaPointer.current) {
      pressKey(keyId)
    }
    interactedViaPointer.current = false
    props.onClick?.(event)
  }

  return (
    <button
      type="button"
      aria-label={config.label}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-md sm:rounded-lg",
        sizeClasses[config.size ?? "normal"],
        "border-[0.5px] border-neutral-400/35 bg-white",
        "shadow-[0_1px_1px_0_rgb(0_0_0/0.08),0_2px_4px_0_rgb(0_0_0/0.06),inset_0_1px_0_rgb(255_255_255/0.9)]",
        "transition-[transform,box-shadow,background-color,border-color] duration-75 ease-out",
        "select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40",
        pressed &&
          "translate-y-px border-neutral-400/25 bg-neutral-50 shadow-[inset_0_1px_3px_rgb(0_0_0/0.1)]",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      {...props}
    >
      <span
        className={cn(
          "relative z-10 font-medium tracking-tight text-neutral-600 transition-colors group-active:text-neutral-700",
          "drop-shadow-[0_1px_0_rgb(255_255_255/0.85)]",
          config.modifier
            ? "text-[0.55rem] sm:text-[0.65rem] md:text-xs uppercase"
            : "text-[0.75rem] sm:text-[0.9rem] md:text-[1.05rem]"
        )}
      >
        {config.label}
      </span>
    </button>
  )
}
