import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        application: true,
        member: true,
      },
    });

    if (!user) return unauthorized();

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        region: user.region,
        role: user.role,
        createdAt: user.createdAt,
        application: user.application,
        member: user.member,
      },
    });

  } catch (error) {
    console.error('Me error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
