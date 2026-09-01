import { Keyboard } from "@/components/keyboard/keyboard";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-end justify-center overflow-hidden bg-gradient-to-b from-[#ececec] to-[#d8d8d8] px-4 pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgb(0_0_0/0.06),transparent)]" />
      <Keyboard />
    </main>
  );
}
