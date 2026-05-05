import { prisma } from "@/lib/prisma";
import { requireMentor } from "@/actions/mentor";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function MentorAnnouncementsPage() {
  const { dbUser } = await requireMentor();
  const trackIds = dbUser.mentorTracks.map(t => t.id);

  // Mentor can only see announcements targeting their tracks
  const trackSlugs = dbUser.mentorTracks.map(t => t.slug);

  const announcements = await prisma.announcement.findMany({
    where: { target: { in: trackSlugs } },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  });

  const tracks = dbUser.mentorTracks.map(t => ({ id: t.id, title: t.title, slug: t.slug }));

  return <AnnouncementsClient announcements={announcements} tracks={tracks} mentorId={dbUser.id} />;
}
