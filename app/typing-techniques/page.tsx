import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Typing Techniques",
  description: "Practical tips to improve your typing speed and accuracy.",
}

const techniques = [
  {
    title: "Home row first",
    description:
      "Keep your index fingers on F and J. Let every other key reach come from that anchor instead of looking down.",
  },
  {
    title: "Light touch",
    description:
      "Press keys with just enough force to register. A softer touch reduces fatigue and helps you move faster.",
  },
  {
    title: "Eyes on the words",
    description:
      "Read one word ahead of where your fingers are. Your accuracy improves when your focus stays on the text, not the keys.",
  },
  {
    title: "Rhythm over rush",
    description:
      "Steady pacing beats short bursts of speed. Consistent timing makes it easier to recover from mistakes.",
  },
  {
    title: "Fix errors quickly",
    description:
      "Use backspace to correct the current word, then keep moving. Do not restart the whole line after one slip.",
  },
  {
    title: "Short daily sessions",
    description:
      "Ten focused minutes every day builds muscle memory faster than one long session once a week.",
  },
]

export default function TypingTechniquesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10 font-sans sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/kylp.png"
              alt="kylp"
              width={36}
              height={36}
              className="size-8 rounded-lg sm:size-9"
              priority
            />
            <span className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
              kylp
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Guide</p>
            <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Typing techniques
            </h1>
          </div>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Back to practice
        </Link>
      </div>

      <p className="mb-10 text-base leading-7 text-muted-foreground sm:text-lg">
        Small habits compound quickly. Use these techniques while you practice
        to build speed without sacrificing accuracy.
      </p>

      <div className="flex flex-col gap-4">
        {techniques.map((technique, index) => (
          <article
            key={technique.title}
            className="rounded-xl border border-black/10 bg-white/70 p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05)]"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mb-2 text-lg font-medium text-foreground">
              {technique.title}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              {technique.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}
