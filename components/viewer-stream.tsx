'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Maximize2, Volume2, VolumeX } from "lucide-react"
import { io } from 'socket.io-client'
import { WebRTCConnection } from '@/lib/webrtc'

interface ViewerStreamProps {
    streamCode: string
    onLeave: () => void
}

export function ViewerStream({ streamCode, onLeave }: ViewerStreamProps) {
    const [isMuted, setIsMuted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const socketRef = useRef<any>(null)
    const connectionRef = useRef<WebRTCConnection | null>(null)

    useEffect(() => {
        console.log('Initializing viewer connection...')
        socketRef.current = io('http://localhost:3000', {
            path: '/api/socket',
            transports: ['websocket', 'polling']
        })

        connectionRef.current = new WebRTCConnection(socketRef.current, (stream) => {
            console.log('Received stream in viewer')
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream
                videoRef.current.play().catch(console.error)
            }
        })

        socketRef.current.emit('join-stream', streamCode)

        socketRef.current.on('stream-ended', () => {
            console.log('Stream ended by creator')
            onLeave()
        })

        return () => {
            connectionRef.current?.close()
            socketRef.current?.disconnect()
        }
    }, [streamCode, onLeave])

    const toggleFullscreen = async () => {
        if (!containerRef.current) return

        if (document.fullscreenElement) {
            await document.exitFullscreen()
        } else {
            await containerRef.current.requestFullscreen()
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(!isMuted)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <div
                ref={containerRef}
                className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:text-white/70"
                                onClick={toggleMute}
                            >
                                {isMuted ? <VolumeX /> : <Volume2 />}
                            </Button>
                            <span className="text-white font-mono">
                                Code: {streamCode}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:text-white/70"
                                onClick={toggleFullscreen}
                            >
                                <Maximize2 />
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={onLeave}
                            >
                                Leave
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}