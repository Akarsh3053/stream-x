'use client'

import { useEffect, useRef } from 'react'

interface StreamPreviewProps {
    screenStream: MediaStream | null
    cameraStream: MediaStream | null
}

export function StreamPreview({ screenStream, cameraStream }: StreamPreviewProps) {
    const screenRef = useRef<HTMLVideoElement>(null)
    const cameraRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (screenRef.current && screenStream) {
            screenRef.current.srcObject = screenStream
        }
        if (cameraRef.current && cameraStream) {
            cameraRef.current.srcObject = cameraStream
        }
    }, [screenStream, cameraStream])

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={screenRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
            />
            <video
                ref={cameraRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-4 right-4 w-32 h-32 rounded-full object-cover border-2 border-white"
            />
        </div>
    )
}