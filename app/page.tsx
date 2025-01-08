import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Streaming Platform
      </h1>
      <div className="flex gap-4">
        <Link href="/creator">
          <Button size="lg">
            Start Streaming
          </Button>
        </Link>
        <Link href="/viewer">
          <Button size="lg" variant="outline">
            Join Stream
          </Button>
        </Link>
      </div>
    </main>
  )
}