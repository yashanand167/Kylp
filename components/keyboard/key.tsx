"use client"

import { useRef, useState, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import type { KeyConfig } from "@/lib/keyboard-keys"
import { useKeyboard } from "@/providers/keyboard.context"

const sizeClasses: Record<NonNullable<KeyConfig["size"]>, string> = {
  normal: "aspect-square size-15",
  wide: "h-15 min-w-20 px-3",
  "extra-wide": "h-15 min-w-24 px-3",
  space: "h-15 min-w-64 px-3",
}

type KeyProps = {
  keyId: string
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

export function Key({ keyId, className, ...props }: KeyProps) {
  const { onClick, getKeyConfig, isKeyPressed } = useKeyboard()
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
    onClick(keyId)
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
      onClick(keyId)
    }
    interactedViaPointer.current = false
    props.onClick?.(event)
  }

  return (
    <button
      type="button"
      aria-label={config.label}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-lg",
        sizeClasses[config.size ?? "normal"],
        "border-[0.5px] border-black/12 bg-white",
        "shadow-[0_1px_1px_0_rgb(0_0_0/0.08),0_2px_4px_0_rgb(0_0_0/0.06),inset_0_1px_0_rgb(255_255_255/0.9)]",
        "transition-[transform,box-shadow,background-color] duration-75 ease-out",
        "select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40",
        pressed &&
          "translate-y-px border-black/8 bg-neutral-50 shadow-[inset_0_1px_3px_rgb(0_0_0/0.1)]",
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
          config.modifier ? "text-xs uppercase" : "text-[1.05rem]"
        )}
      >
        {config.label}
      </span>
    </button>
  )
}
