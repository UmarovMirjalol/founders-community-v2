import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized, forbidden } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'ADMIN') return forbidden();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {};
    if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true,
            region: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ applications });

  } catch (error) {
    console.error('List applications error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
