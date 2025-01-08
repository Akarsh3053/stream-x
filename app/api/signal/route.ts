import { NextRequest, NextResponse } from 'next/server';

const connections: Record<string, any> = {};

export async function POST(req: NextRequest) {
    const { streamCode, type, payload } = await req.json();

    if (type === 'offer') {
        connections[streamCode] = { offer: payload };
        return NextResponse.json({ message: 'Offer saved' });
    } else if (type === 'answer') {
        if (connections[streamCode]) {
            connections[streamCode].answer = payload;
            return NextResponse.json({ message: 'Answer saved' });
        }
        return NextResponse.json({ message: 'Stream not found' }, { status: 404 });
    } else if (type === 'getOffer') {
        if (connections[streamCode]?.offer) {
            return NextResponse.json({ offer: connections[streamCode].offer });
        }
        return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    } else if (type === 'getAnswer') {
        if (connections[streamCode]?.answer) {
            return NextResponse.json({ answer: connections[streamCode].answer });
        }
        return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
}
