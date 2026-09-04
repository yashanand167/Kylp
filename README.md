# kylp

A typing practice app with a tactile on-screen keyboard, one-minute WPM tests, and key click sound.

**Design engineering** — keys are built like hardware: depth, shadow, and press states that feel physical. Audio is tuned to read as keyboard, not metal.

**UI** — words first. Current, correct, and missed states stay scannable. The test stays quiet until you hit Start.

**Global context** — one `KeyboardProvider` wires physical keys, virtual keys, and sound so every route shares the same input layer.

Also includes a short typing techniques guide(coming soon!)
