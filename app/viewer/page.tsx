'use client';

import React, { useRef, useState } from 'react';

export default function Viewer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const [streamCode, setStreamCode] = useState('');

    const joinStream = async () => {
        // TODO: Fetch WebRTC offer and establish connection
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Join Stream</h1>
            <input
                type="text"
                placeholder="Enter Stream Code"
                value={streamCode}
                onChange={(e) => setStreamCode(e.target.value)}
                className="border px-4 py-2 rounded w-full"
            />
            <button onClick={joinStream} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Join</button>
            <div className="flex space-x-4 mt-4">
                <video ref={videoRef} autoPlay playsInline className="w-1/2 border" />
                <video ref={screenRef} autoPlay playsInline className="w-1/2 border" />
            </div>
        </div>
    );
}
