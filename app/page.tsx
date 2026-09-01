import { Keyboard } from "@/components/keyboard/keyboard";
import { WritingPractice } from "@/components/writing-practice";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#ececec] to-[#d8d8d8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgb(0_0_0/0.06),transparent)]" />

      <div className="relative flex flex-1 items-center justify-center px-4 pt-10">
        <WritingPractice />
      </div>

      <div className="relative flex justify-center px-4 pb-8">
        <Keyboard />
      </div>
    </main>
  );
}
