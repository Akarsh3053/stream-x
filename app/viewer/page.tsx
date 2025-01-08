'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ViewerStream } from "@/components/viewer-stream"

export default function ViewerPage() {
    const [streamCode, setStreamCode] = useState('')
    const [isJoined, setIsJoined] = useState(false)

    const joinStream = () => {
        if (streamCode.length === 6) {
            setIsJoined(true)
        }
    }

    if (isJoined) {
        return <ViewerStream streamCode={streamCode} onLeave={() => setIsJoined(false)} />
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
            <div className="flex w-full max-w-sm items-center gap-2">
                <Input
                    value={streamCode}
                    onChange={(e) => setStreamCode(e.target.value)}
                    placeholder="Enter stream code"
                    maxLength={6}
                    className="text-center font-mono"
                />
                <Button onClick={joinStream} disabled={streamCode.length !== 6}>
                    Join
                </Button>
            </div>
        </div>
    )
}