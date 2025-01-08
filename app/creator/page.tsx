'use client';

import React, { useRef } from 'react';

export default function Creator() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);

    const startStream = async () => {
        const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = webcamStream;

        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (screenRef.current) screenRef.current.srcObject = screenStream;

        // TODO: Send WebRTC offer to the signaling API
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <button onClick={startStream} className="bg-blue-500 text-white px-4 py-2 rounded">Start Stream</button>
            <div className="flex space-x-4 mt-4">
                <video ref={videoRef} autoPlay playsInline className="w-1/2 border" />
                <video ref={screenRef} autoPlay playsInline className="w-1/2 border" />
            </div>
        </div>
    );
}
