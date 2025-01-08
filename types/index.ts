import { Server as NetServer, Socket as NetSocket } from 'net'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'

export interface Room {
    creator: string
    viewers: string[]
}

export interface ServerToClientEvents {
    'viewer-joined': (viewerId: string) => void
    'stream-ended': () => void
    'offer': (data: { offer: RTCSessionDescriptionInit, from: string }) => void
    'answer': (data: { answer: RTCSessionDescriptionInit, from: string }) => void
    'ice-candidate': (data: { candidate: RTCIceCandidate, from: string }) => void
}

export interface ClientToServerEvents {
    'create-stream': (streamCode: string) => void
    'join-stream': (streamCode: string) => void
    'offer': (data: { target: string, offer: RTCSessionDescriptionInit }) => void
    'answer': (data: { target: string, answer: RTCSessionDescriptionInit }) => void
    'ice-candidate': (data: { target: string, candidate: RTCIceCandidate }) => void
}

export interface InterServerEvents {
    ping: () => void
}

export interface SocketData {
    streamCode?: string
}

export type SocketServer = SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>

declare global {
    var socketIO: SocketServer | undefined
}