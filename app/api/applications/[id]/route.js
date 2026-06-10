import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized, forbidden } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'ADMIN') return forbidden();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return Response.json(
        { error: 'Status must be ACCEPTED or REJECTED' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (status === 'ACCEPTED') {
      // Atomically: update application + create member + update user role
      const [updatedApp] = await prisma.$transaction([
        prisma.application.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        }),
        prisma.user.update({
          where: { id: application.userId },
          data: { role: 'MEMBER' },
        }),
        prisma.member.upsert({
          where: { userId: application.userId },
          update: {},
          create: {
            userId: application.userId,
            chapter: application.user.region || 'Tashkent',
          },
        }),
      ]);

      return Response.json({ application: updatedApp });
    }

    // REJECTED
    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return Response.json({ application: updatedApp });

  } catch (error) {
    console.error('Update application error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
