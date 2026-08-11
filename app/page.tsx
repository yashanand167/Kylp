import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen gap-2">
    <button className="aspect-square bg-white size-12 rounded-md">
      <h1 className="text-xl text-neutral-500">Q</h1>
    </button>
    <button className="aspect-square bg-white size-12 rounded-md">
      <h1 className="text-xl text-neutral-500">W</h1>
    </button>
    </main>
  );
}
