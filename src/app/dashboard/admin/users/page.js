import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: { track: true },
      },
    },
  });

  const tracks = await prisma.track.findMany();

  // Serialize dates for client component
  const serialized = users.map((u) => ({
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
    tracks: u.enrollments.map((e) => e.track.title),
    trackSlugs: u.enrollments.map((e) => e.track.slug),
  }));

  return <UsersClient users={serialized} tracks={tracks.map(t => ({ slug: t.slug, title: t.title }))} />;
}
