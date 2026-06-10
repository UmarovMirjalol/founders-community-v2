export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getCurrentUser, unauthorized, forbidden } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await getCurrentUser(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'ADMIN') return forbidden();

    const [
      totalUsers,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalMembers,
      applicationsByTrack,
      applicationsByRegion,
    ] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'ACCEPTED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      prisma.member.count(),
      prisma.application.groupBy({
        by: ['track'],
        _count: { track: true },
      }),
      prisma.application.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Get region distribution from users
    const usersByRegion = await prisma.user.groupBy({
      by: ['region'],
      where: { role: { not: 'ADMIN' }, region: { not: null } },
      _count: { region: true },
    });

    const acceptanceRate = totalApplications > 0
      ? Math.round((acceptedApplications / totalApplications) * 100)
      : 0;

    return Response.json({
      analytics: {
        totalUsers,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        totalMembers,
        acceptanceRate,
        byTrack: applicationsByTrack.map(t => ({
          track: t.track,
          count: t._count.track,
        })),
        byRegion: usersByRegion.map(r => ({
          region: r.region,
          count: r._count.region,
        })),
      },
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
