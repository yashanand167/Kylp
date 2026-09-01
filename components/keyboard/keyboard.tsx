import { KEYBOARD_LAYOUT } from "@/lib/keyboard-keys"
import { Key } from "@/components/keyboard/key"

export function Keyboard() {
  return (
    <div className="flex flex-col items-center gap-2 p-6">
      {KEYBOARD_LAYOUT.map((row) => (
        <div key={row.join("-")} className="flex items-center gap-2">
          {row.map((keyId) => (
            <Key key={keyId} keyId={keyId} />
          ))}
        </div>
      ))}
    </div>
  )
}
