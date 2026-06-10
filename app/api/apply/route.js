export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

export async function POST(request) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();

    const body = await request.json();
    const { track, motivation } = body;

    if (!track || !motivation) {
      return Response.json(
        { error: 'Track and motivation are required' },
        { status: 400 }
      );
    }

    const validTracks = ['FOUNDER', 'VENTURE', 'RESEARCH'];
    if (!validTracks.includes(track)) {
      return Response.json(
        { error: 'Invalid track. Choose FOUNDER, VENTURE, or RESEARCH' },
        { status: 400 }
      );
    }

    // Check if user already has an application
    const existing = await prisma.application.findUnique({
      where: { userId: payload.id },
    });

    if (existing) {
      return Response.json(
        { error: 'You have already submitted an application' },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        userId: payload.id,
        track,
        motivation,
        status: 'PENDING',
      },
    });

    return Response.json({ application }, { status: 201 });

  } catch (error) {
    console.error('Apply error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
