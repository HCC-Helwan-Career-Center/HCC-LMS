import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: { track: true },
      },
      mentorTracks: true,
    },
  });

  const tracks = await prisma.track.findMany();

  // Serialize dates for client component
  const serialized = users.map((u) => {
    // Combine enrollments and mentorTracks
    const trackSet = new Map();
    u.enrollments.forEach(e => trackSet.set(e.track.slug, e.track.title));
    u.mentorTracks.forEach(t => trackSet.set(t.slug, t.title));

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      universityId: u.universityId,
      phone: u.phone,
      academicYear: u.academicYear,
      department: u.department,
      github: u.github,
      linkedin: u.linkedin,
      role: u.role,
      emailVerified: u.emailVerified ? true : false,
      createdAt: u.createdAt.toISOString().split("T")[0],
      tracks: Array.from(trackSet.values()),
      trackSlugs: Array.from(trackSet.keys()),
    };
  });

  return <UsersClient users={serialized} tracks={tracks.map(t => ({ id: t.id, slug: t.slug, title: t.title }))} />;
}
