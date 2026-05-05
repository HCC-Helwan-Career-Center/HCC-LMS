import { prisma } from "@/lib/prisma";
import TracksClient from "./TracksClient";

export default async function TracksPage() {
  const tracks = await prisma.track.findMany({
    include: {
      enrollments: {
        include: { user: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  const serialized = tracks.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    description: t.description,
    color: t.color,
    studentCount: t.enrollments.filter((e) => e.user.role === "student").length,
    mentorCount: t.enrollments.filter((e) => e.user.role === "mentor").length,
    totalEnrollments: t._count.enrollments,
    enrollments: t.enrollments.map((e) => ({
      id: e.id,
      userName: e.user.name,
      userEmail: e.user.email,
      createdAt: e.createdAt.toISOString().split("T")[0],
    })),
  }));

  return <TracksClient tracks={serialized} />;
}
