import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  try {
    // 1. Authenticate user
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'ADMIN') return forbidden();

    // 2. Safely parse route parameters (Next.js 14/15 compatible)
    const params = context?.params ? await context.params : null;
    if (!params || !params.id) {
      return Response.json(
        { error: 'Missing application ID' },
        { status: 400 }
      );
    }
    const { id } = params;

    // 3. Safely parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { status } = body;
    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return Response.json(
        { error: 'Status must be ACCEPTED or REJECTED' },
        { status: 400 }
      );
    }

    // 4. Find the application and linked user
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
      // Ensure the associated user exists before updating
      if (!application.userId) {
        return Response.json(
          { error: 'Application has no associated user ID' },
          { status: 400 }
        );
      }

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
            chapter: application.user?.region || 'Tashkent',
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
