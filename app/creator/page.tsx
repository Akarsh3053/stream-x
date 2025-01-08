'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { StreamPreview } from "@/components/stream-preview"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
import { WebRTCConnection } from '@/lib/webrtc'

export default function CreatorPage() {
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamCode, setStreamCode] = useState('')
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
    const socketRef = useRef<any>(null)
    const connectionsRef = useRef<Map<string, WebRTCConnection>>(new Map())

    useEffect(() => {
        socketRef.current = io('http://localhost:3000', {
            path: '/api/socket',
            transports: ['websocket', 'polling']
        })

        socketRef.current.on('viewer-joined', async (viewerId: string) => {
            console.log('Viewer joined:', viewerId)
            if (screenStream && cameraStream) {
                try {
                    const connection = new WebRTCConnection(socketRef.current, () => { })
                    await connection.addStreams(screenStream, cameraStream)
                    const offer = await connection.createOffer()

                    console.log('Sending offer to viewer:', viewerId)
                    socketRef.current.emit('offer', {
                        target: viewerId,
                        offer
                    })

                    connectionsRef.current.set(viewerId, connection)
                } catch (error) {
                    console.error('Error setting up viewer connection:', error)
                }
            }
        })

        return () => {
            socketRef.current?.disconnect()
            connectionsRef.current.forEach(connection => connection.close())
        }
    }, [screenStream, cameraStream])

    const startStream = async () => {
        try {
            console.log('Starting streams...')
            const screen = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    //@ts-expect-error
                    cursor: "always"
                },
                audio: true
            })

            const camera = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })

            setScreenStream(screen)
            setCameraStream(camera)
            const code = uuidv4().substring(0, 6)
            setStreamCode(code)
            socketRef.current?.emit('create-stream', code)
            setIsStreaming(true)
            console.log('Streams started successfully')
        } catch (error) {
            console.error('Error accessing media devices:', error)
        }
    }

    const stopStream = () => {
        console.log('Stopping streams...')
        screenStream?.getTracks().forEach(track => track.stop())
        cameraStream?.getTracks().forEach(track => track.stop())
        connectionsRef.current.forEach(connection => connection.close())
        connectionsRef.current.clear()
        setScreenStream(null)
        setCameraStream(null)
        setIsStreaming(false)
        setStreamCode('')
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
            {!isStreaming ? (
                <Button size="lg" onClick={startStream}>
                    Start Stream
                </Button>
            ) : (
                <div className="w-full max-w-4xl flex flex-col gap-4">
                    <StreamPreview
                        screenStream={screenStream}
                        cameraStream={cameraStream}
                    />
                    <div className="flex items-center gap-4">
                        <Input
                            value={streamCode}
                            readOnly
                            className="text-center font-mono"
                        />
                        <Button variant="destructive" onClick={stopStream}>
                            End Stream
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}