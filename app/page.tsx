import { Key } from "@/components/keyboard/key";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center gap-2">
      <Key keyId="q" />
      <Key keyId="w" />
      <Key keyId="e" />
      <Key keyId="r" />
      <Key keyId="t" />
      <Key keyId="y" />
      <Key keyId="u" />
      <Key keyId="i" />
      <Key keyId="o" />
      <Key keyId="p" />
    </main>
  );
}
