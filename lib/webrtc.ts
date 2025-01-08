import { Socket } from 'socket.io-client'

export class WebRTCConnection {
    peerConnection: RTCPeerConnection
    socket: Socket
    remoteStream: MediaStream
    onTrack: (stream: MediaStream) => void

    constructor(socket: Socket, onTrack: (stream: MediaStream) => void) {
        this.socket = socket
        this.onTrack = onTrack
        this.remoteStream = new MediaStream()

        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:stun1.l.google.com:19302',
                    ],
                },
            ],
        })

        this.setupPeerConnectionHandlers()
        this.setupSocketHandlers()
    }

    private setupPeerConnectionHandlers() {
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    target: this.socket.id,
                })
            }
        }

        this.peerConnection.ontrack = (event) => {
            console.log('Received track:', event.track.kind)
            const stream = event.streams[0]
            if (stream) {
                this.remoteStream = stream
                this.onTrack(stream)
            }
        }

        // Log connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection.connectionState)
        }

        // Log ICE connection state changes
        this.peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', this.peerConnection.iceConnectionState)
        }
    }

    private setupSocketHandlers() {
        this.socket.on('offer', async ({ offer, from }) => {
            try {
                console.log('Received offer')
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                const answer = await this.peerConnection.createAnswer()
                await this.peerConnection.setLocalDescription(answer)

                this.socket.emit('answer', {
                    answer,
                    target: from,
                })
            } catch (error) {
                console.error('Error handling offer:', error)
            }
        })

        this.socket.on('answer', async ({ answer, from }) => {
            try {
                console.log('Received answer')
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            } catch (error) {
                console.error('Error handling answer:', error)
            }
        })

        this.socket.on('ice-candidate', async ({ candidate, from }) => {
            try {
                console.log('Received ICE candidate')
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            } catch (error) {
                console.error('Error handling ICE candidate:', error)
            }
        })
    }

    async addStreams(screenStream: MediaStream, cameraStream: MediaStream) {
        try {
            const tracks = [...screenStream.getTracks(), ...cameraStream.getTracks()]
            tracks.forEach(track => {
                console.log('Adding track:', track.kind)
                this.peerConnection.addTrack(track, screenStream)
            })
        } catch (error) {
            console.error('Error adding streams:', error)
        }
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            })
            await this.peerConnection.setLocalDescription(offer)
            return offer
        } catch (error) {
            console.error('Error creating offer:', error)
            throw error
        }
    }

    close() {
        this.peerConnection.close()
    }
}