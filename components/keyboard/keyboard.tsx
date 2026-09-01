import { KEYBOARD_LAYOUT } from "@/lib/keyboard-keys"
import { Key } from "@/components/keyboard/key"

export function Keyboard() {
  return (
    <div className="flex w-full justify-center overflow-x-auto pb-1">
      <div className="mx-auto w-max origin-bottom scale-[0.92] sm:scale-100">
        <div className="relative rounded-2xl border border-black/15 bg-white/20 p-1.5 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.28),0_8px_16px_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.55)] sm:rounded-[20px] sm:p-2.5">
          <div className="rounded-xl bg-neutral-200 p-2 shadow-[inset_0_3px_8px_rgb(0_0_0/0.14),inset_0_1px_0_rgb(255_255_255/0.12)] sm:rounded-2xl sm:p-4 md:p-5">
            <div className="flex flex-col items-center gap-1 sm:gap-[5px] md:gap-[7px]">
              {KEYBOARD_LAYOUT.map((row) => (
                <div
                  key={row.join("-")}
                  className="flex items-center gap-1 sm:gap-[5px] md:gap-[7px]"
                >
                  {row.map((keyId) => (
                    <Key key={keyId} keyId={keyId} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-2 bottom-1 h-px rounded-full bg-white/30 sm:inset-x-3 sm:bottom-1.5" />
        </div>
      </div>
    </div>
  )
}
