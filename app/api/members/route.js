export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();

    const members = await prisma.member.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            region: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return Response.json({ members });

  } catch (error) {
    console.error('Members error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
