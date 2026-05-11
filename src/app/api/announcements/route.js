import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ announcements: [] });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      role: true,
      enrollments: { select: { track: { select: { slug: true } } } },
      mentorTracks: { select: { slug: true } },
    },
  });

  if (!user) return NextResponse.json({ announcements: [] });

  let where = {};

  if (user.role === "mentor") {
    const slugs = user.mentorTracks.map(t => t.slug);
    slugs.push("all");
    where = { target: { in: slugs } };
  } else if (user.role !== "admin") {
    const slugs = user.enrollments.map(e => e.track.slug);
    slugs.push("all");
    where = { target: { in: slugs } };
  }
  // admin: no filter — sees everything

  const announcements = await prisma.announcement.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, createdAt: true },
  });

  return NextResponse.json({
    announcements: announcements.map(a => ({
      id: a.id,
      title: a.title,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}
