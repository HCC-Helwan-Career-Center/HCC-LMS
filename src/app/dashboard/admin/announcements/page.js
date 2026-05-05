import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const tracks = await prisma.track.findMany({ select: { slug: true, title: true } });

  const serialized = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    target: a.target,
    authorName: a.author.name,
    createdAt: a.createdAt.toISOString().split("T")[0],
  }));

  return <AnnouncementsClient announcements={serialized} tracks={tracks} />;
}
