import { Server } from 'socket.io'
import { NextResponse } from 'next/server'
import type {
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
    Room,
    SocketServer
} from '@/types'

const rooms = new Map<string, Room>()

if (!global.socketIO) {
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)

        socket.on('create-stream', (streamCode) => {
            socket.join(streamCode)
            rooms.set(streamCode, { creator: socket.id, viewers: [] })
            console.log(`Stream created: ${streamCode}`)
        })

        socket.on('join-stream', (streamCode) => {
            const room = rooms.get(streamCode)
            if (room) {
                socket.join(streamCode)
                room.viewers.push(socket.id)
                socket.to(room.creator).emit('viewer-joined', socket.id)
                console.log(`Viewer ${socket.id} joined stream: ${streamCode}`)
            }
        })

        socket.on('offer', ({ target, offer }) => {
            socket.to(target).emit('offer', {
                offer,
                from: socket.id
            })
        })

        socket.on('answer', ({ target, answer }) => {
            socket.to(target).emit('answer', {
                answer,
                from: socket.id
            })
        })

        socket.on('ice-candidate', ({ target, candidate }) => {
            socket.to(target).emit('ice-candidate', {
                candidate,
                from: socket.id
            })
        })

        socket.on('disconnect', () => {
            // Convert Map.entries() to Array before using for...of
            Array.from(rooms.entries()).forEach(([streamCode, room]) => {
                if (room.creator === socket.id) {
                    io.to(streamCode).emit('stream-ended')
                    rooms.delete(streamCode)
                } else if (room.viewers.includes(socket.id)) {
                    room.viewers = room.viewers.filter((viewerId: string) => viewerId !== socket.id)
                }
            })
            console.log('Client disconnected:', socket.id)
        })
    })

    global.socketIO = io as SocketServer
}

export async function GET() {
    return new NextResponse('WebSocket server is running')
}

export const dynamic = 'force-dynamic'